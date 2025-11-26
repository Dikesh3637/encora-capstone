package com.techademy.productcatalog.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.http.SdkHttpClient;
import software.amazon.awssdk.http.TlsTrustManagersProvider;
import software.amazon.awssdk.http.apache.ApacheHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.s3.S3Client;

import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.cert.X509Certificate;

@Configuration
public class AwsConfig {

	@Value("${app.aws.region}")
	private String awsRegion;

	@Value("${app.aws.access-key-id}")
	private String accessKeyId;

	@Value("${app.aws.secret-access-key}")
	private String secretAccessKey;

	private StaticCredentialsProvider credentialsProvider() {
		AwsBasicCredentials creds = AwsBasicCredentials.create(accessKeyId, secretAccessKey);
		return StaticCredentialsProvider.create(creds);
	}

	@Bean
	public S3Client s3Client() {
		return S3Client.builder().region(Region.of(awsRegion)).credentialsProvider(credentialsProvider()).build();
	}

	@Bean
	public DynamoDbClient dynamoDbClient() {
		TlsTrustManagersProvider trustAllProvider = () -> new TrustManager[] { new X509TrustManager() {
			@Override
			public void checkClientTrusted(X509Certificate[] chain, String authType) {
			}

			@Override
			public void checkServerTrusted(X509Certificate[] chain, String authType) {
			}

			@Override
			public X509Certificate[] getAcceptedIssuers() {
				return new X509Certificate[0];
			}
		} };

		SdkHttpClient insecureHttpClient = ApacheHttpClient.builder().tlsTrustManagersProvider(trustAllProvider)
				.build();

		return DynamoDbClient.builder().httpClient(insecureHttpClient).region(Region.of(awsRegion))
				.credentialsProvider(credentialsProvider()).build();
	}
}
