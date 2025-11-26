package com.techademy.productcatalog.repository;

import com.techademy.productcatalog.entity.Product;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

	@Override
	@EntityGraph(attributePaths = "sizes")
	java.util.Optional<Product> findById(Long id);
}
