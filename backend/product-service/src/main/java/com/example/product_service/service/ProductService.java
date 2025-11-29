package com.example.product_service.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.example.product_service.builder.ProductSpecificationBuilder;
import com.example.product_service.dto.CreateCategoryDto;
import com.example.product_service.dto.CreateProductDto;
import com.example.product_service.entity.Category;
import com.example.product_service.entity.Product;
import com.example.product_service.entity.ProductVariant;
import com.example.product_service.enums.Gender;
import com.example.product_service.enums.Size;
import com.example.product_service.exception.ProductNotFoundError;
import com.example.product_service.repository.CategoryRepository;
import com.example.product_service.repository.ProductRepository;
import com.example.product_service.repository.ProductVariantRepository;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private ProductRepository productRepository;

    private ProductVariantRepository productVariantRepository;

    private CategoryRepository categoryRepository;

    private AmazonS3 s3Client;

    @Value("${app.aws.s3.bucket-name}")
    private String bucketName;

    @Value("${app.aws.public-url:https://productcatalog-images-bucket.s3.ap-south-1.amazonaws.com/}")
    private String publicUrl;

    public ProductService(ProductRepository productRepository,
            ProductVariantRepository productVariantRepository,
            CategoryRepository categoryRepository,
            AmazonS3 s3Client) {
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
        this.categoryRepository = categoryRepository;
        this.s3Client = s3Client;
    }

    public Page<Product> getFilteredProducts(
            List<Long> categoryIds,
            Gender gender,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean inStockOnly,
            String searchTerm,
            Pageable pageable) {
        Specification<Product> spec = Specification.<Product>where(null)
                .and(ProductSpecificationBuilder.hasCategory(categoryIds))
                .and(ProductSpecificationBuilder.hasGender(gender))
                .and(
                        ProductSpecificationBuilder.hasPriceBetween(minPrice, maxPrice))
                .and(
                        ProductSpecificationBuilder.searchInNameOrDescription(
                                searchTerm));

        if (Boolean.TRUE.equals(inStockOnly)) {
            spec = spec.and(ProductSpecificationBuilder.hasStock());
        }

        return productRepository.findAll(spec, pageable);
    }

    public Product getProductById(Long id) {
        return productRepository
                .findById(id)
                .orElseThrow(() -> new ProductNotFoundError(
                        "product with the id " + id + " not found"));
    }

    @Transactional
    public Product createProduct(CreateProductDto dto, MultipartFile image) {
        // 1. Upload image to S3
        String imageUrl = uploadImageToS3(image);
        System.out.println("Image uploaded: " + imageUrl);

        // 2. Find category
        Category category = categoryRepository.findById(Long.parseLong(dto.getCategoryId()))
                .orElseThrow(() -> new RuntimeException("Category not found: " + dto.getCategoryId()));

        // 3. Create product
        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setGender(dto.getGender());
        product.setCategory(category);
        product.setUrl(imageUrl);

        // 4. Save product
        Product savedProduct = productRepository.save(product);

        // 5. Create variants
        Map<String, Integer> sizes = dto.getSizes();
        for (Map.Entry<String, Integer> entry : sizes.entrySet()) {
            String sizeStr = entry.getKey();
            Integer stock = entry.getValue();

            if (stock > 0) {
                try {
                    Size size = Size.valueOf(sizeStr);
                    ProductVariant variant = new ProductVariant();
                    variant.setProduct(savedProduct);
                    variant.setSize(size);
                    variant.setStockQuantity(stock);
                    productVariantRepository.save(variant);
                } catch (IllegalArgumentException e) {
                    System.out.println("Invalid size skipped: " + sizeStr);
                }
            }
        }

        System.out.println("Product saved: " + savedProduct.getId());
        return savedProduct;
    }

    @Transactional
    public Category createCategory(CreateCategoryDto dto) {
        // Capitalize first letter
        String name = dto.getName().trim();
        if (name.isEmpty()) {
            throw new RuntimeException("Category name cannot be empty");
        }
        String normalizedName = Character.toUpperCase(name.charAt(0)) + name.substring(1);

        if (categoryRepository.existsByName(normalizedName)) {
            throw new RuntimeException("Category '" + normalizedName + "' already exists");
        }

        Category category = new Category();
        category.setName(normalizedName);
        category.setDescription(dto.getDescription());

        Category savedCategory = categoryRepository.save(category);
        System.out.println("Category saved: " + savedCategory.getId());
        return savedCategory;
    }

    private String uploadImageToS3(MultipartFile image) {
        if (image == null || image.isEmpty()) {
            throw new RuntimeException("Image file is required");
        }

        try {
            String fileName = "products/" + UUID.randomUUID() + "_" + image.getOriginalFilename();
            String fileUrl = publicUrl + fileName;

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(image.getSize());
            metadata.setContentType(image.getContentType());

            s3Client.putObject(new PutObjectRequest(
                    bucketName,
                    fileName,
                    image.getInputStream(),
                    metadata));

            System.out.println("Image uploaded: " + fileUrl);
            return fileUrl;
        } catch (IOException e) {
            throw new RuntimeException("Image upload failed: " + e.getMessage(), e);
        }
    }

    @Transactional
    public Product updateProduct(Long id, CreateProductDto dto, MultipartFile image) {
        // 1. Find existing product
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundError("Product not found with id: " + id));

        // 2. Update Basic Info
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setGender(dto.getGender());

        // 3. Update Category
        Category category = categoryRepository.findById(Long.parseLong(dto.getCategoryId()))
                .orElseThrow(() -> new RuntimeException("Category not found: " + dto.getCategoryId()));
        product.setCategory(category);

        // 4. Update Image
        if (image != null && !image.isEmpty()) {
            String newImageUrl = uploadImageToS3(image);
            product.setUrl(newImageUrl);
        }

        // 5. Update Variants
        Map<String, Integer> sizes = dto.getSizes();

        if (sizes != null) {
            for (Map.Entry<String, Integer> entry : sizes.entrySet()) {
                String sizeStr = entry.getKey();
                Integer stock = entry.getValue();

                try {
                    Size size = Size.valueOf(sizeStr);

                    // Check if this size already exists for this product
                    ProductVariant existingVariant = product.getVariants().stream()
                            .filter(v -> v.getSize() == size)
                            .findFirst()
                            .orElse(null);

                    if (existingVariant != null) {
                        existingVariant.setStockQuantity(stock);
                    } else {
                        if (stock > 0) {
                            ProductVariant newVariant = new ProductVariant();
                            newVariant.setProduct(product); // Link to parent
                            newVariant.setSize(size);
                            newVariant.setStockQuantity(stock);
                            product.getVariants().add(newVariant);
                        }
                    }
                } catch (IllegalArgumentException e) {
                    System.out.println("Invalid size skipped in update: " + sizeStr);
                }
            }
        }

        // 6. Save Product
        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundError("Product not found with id: " + id));
        productRepository.delete(product);
    }
}
