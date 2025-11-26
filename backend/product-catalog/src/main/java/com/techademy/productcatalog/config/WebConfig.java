package com.techademy.productcatalog.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	private final RoleBasedAccessInterceptor roleBasedAccessInterceptor;

	@Autowired
	public WebConfig(RoleBasedAccessInterceptor roleBasedAccessInterceptor) {
		this.roleBasedAccessInterceptor = roleBasedAccessInterceptor;
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(roleBasedAccessInterceptor).addPathPatterns("/api/v1/products/**");
	}
}
