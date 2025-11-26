package com.techademy.productcatalog.service;

import com.techademy.productcatalog.entity.Product;
import com.techademy.productcatalog.exception.NotFoundException;
import com.techademy.productcatalog.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class ImageStorageService {

	private final S3Client s3Client;
	private final DynamoDbClient dynamoDbClient;
	private final ProductRepository productRepository;
	private final String bucketName;
	private final String tableName;
	private final String region;

	public ImageStorageService(S3Client s3Client, DynamoDbClient dynamoDbClient, ProductRepository productRepository,
			@Value("${app.aws.s3.bucket-name}") String bucketName,
			@Value("${app.aws.dynamodb.table-name}") String tableName, @Value("${app.aws.region}") String region) {
		this.s3Client = s3Client;
		this.dynamoDbClient = dynamoDbClient;
		this.productRepository = productRepository;
		this.bucketName = bucketName;
		this.tableName = tableName;
		this.region = region;
	}

	public ImageUploadResult uploadProductImage(Long productId, MultipartFile file) {
		if (file == null || file.isEmpty()) {
			throw new IllegalArgumentException("File must not be empty");
		}

		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new NotFoundException("Product not found: " + productId));

		String originalFilename = file.getOriginalFilename();
		if (originalFilename == null || originalFilename.isBlank()) {
			originalFilename = "image";
		}

		String key = "products/" + productId + "/" + UUID.randomUUID() + "-" + originalFilename;

		try {
			PutObjectRequest putObjectRequest = PutObjectRequest.builder().bucket(bucketName).key(key)
					.contentType(file.getContentType()).build();

			s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));
		} catch (IOException e) {
			throw new RuntimeException("Failed to read file bytes", e);
		}

		String imageUrl = "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + key;

		product.setImageUrl(imageUrl);
		productRepository.save(product);

		try {
			Map<String, AttributeValue> item = new HashMap<>();
			item.put("productId", AttributeValue.builder().s(String.valueOf(productId)).build());
			item.put("imageKey", AttributeValue.builder().s(key).build());
			item.put("imageUrl", AttributeValue.builder().s(imageUrl).build());
			item.put("uploadedAt", AttributeValue.builder().s(Instant.now().toString()).build());

			PutItemRequest putItemRequest = PutItemRequest.builder().tableName(tableName).item(item).build();

			dynamoDbClient.putItem(putItemRequest);
		} catch (Exception e) {
			System.err.println("Failed to write metadata to DynamoDB: " + e.getMessage());
			e.printStackTrace();
		}

		return new ImageUploadResult(product.getId(), key, imageUrl);
	}

	public static class ImageUploadResult {
		private final Long productId;
		private final String s3Key;
		private final String imageUrl;

		public ImageUploadResult(Long productId, String s3Key, String imageUrl) {
			this.productId = productId;
			this.s3Key = s3Key;
			this.imageUrl = imageUrl;
		}

		public Long getProductId() {
			return productId;
		}

		public String getS3Key() {
			return s3Key;
		}

		public String getImageUrl() {
			return imageUrl;
		}
	}
}
