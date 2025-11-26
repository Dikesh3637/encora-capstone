package com.techademy.productcatalog.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class RoleBasedAccessInterceptor implements HandlerInterceptor {

	private static final String HEADER_ROLES = "x-user-roles";

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {

		String path = request.getRequestURI();
		String method = request.getMethod();
		String rolesHeader = request.getHeader(HEADER_ROLES);

		if (!path.startsWith("/api/v1/products")) {
			return true;
		}

		if (rolesHeader == null || rolesHeader.isBlank()) {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing x-user-roles header");
			return false;
		}

		boolean isAdmin = rolesHeader.contains("ADMIN");
		boolean isUser = rolesHeader.contains("USER");

		// Admin → full access
		if (isAdmin) {
			return true;
		}

		// User → only GET allowed
		if (isUser) {
			if (HttpMethod.GET.matches(method)) {
				return true; // allowed
			} else {
				response.sendError(HttpServletResponse.SC_FORBIDDEN, "USER role is not allowed to modify products");
				return false;
			}
		}

		// Other roles (or unknown) → deny by default
		response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access denied");
		return false;
	}
}
