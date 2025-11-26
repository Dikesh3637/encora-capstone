package com.techademy.productcatalog.controller;

import com.techademy.productcatalog.service.ImageStorageService;
import com.techademy.productcatalog.service.ImageStorageService.ImageUploadResult;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/products")
public class ProductImageController {

	private final ImageStorageService imageStorageService;

	public ProductImageController(ImageStorageService imageStorageService) {
		this.imageStorageService = imageStorageService;
	}

	@PostMapping(value = "/{productId}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ImageUploadResponse> uploadImage(@PathVariable Long productId,
			@RequestPart("file") MultipartFile file) {
		ImageUploadResult result = imageStorageService.uploadProductImage(productId, file);

		ImageUploadResponse response = new ImageUploadResponse(result.getProductId(), result.getS3Key(),
				result.getImageUrl(), "Image uploaded successfully");

		return ResponseEntity.ok(response);
	}

	public static class ImageUploadResponse {
		private Long productId;
		private String s3Key;
		private String imageUrl;
		private String message;

		public ImageUploadResponse(Long productId, String s3Key, String imageUrl, String message) {
			this.productId = productId;
			this.s3Key = s3Key;
			this.imageUrl = imageUrl;
			this.message = message;
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

		public String getMessage() {
			return message;
		}
	}
}
