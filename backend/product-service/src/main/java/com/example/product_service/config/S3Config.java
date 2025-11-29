package com.example.product_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

@Configuration
public class S3Config {
    @Value("${app.aws.s3.access-key-id}")
    private String accessKey;

    @Value("${app.aws.s3.secret-access-key}")
    private String secretKey;

    @Value("${app.aws.region}")
    private String region;

    @Value("${app.aws.s3.bucket-name}")
    private String bucketName;

    @Value("${app.aws.public-url:https://productcatalog-images-bucket.s3.ap-south-1.amazonaws.com/}")
    private String publicUrl;

    @Bean
    public AmazonS3 amazonS3() {
        BasicAWSCredentials credentials = new BasicAWSCredentials(accessKey, secretKey);
        return AmazonS3ClientBuilder.standard()
                .withRegion(region)
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .build();
    }
}
