package com.techademy.orderservice.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.Map;

public class CreateOrderRequest {
    @NotEmpty
    private Map<String, Integer> items; 

    public Map<String, Integer> getItems() {
        return items;
    }

	public void setItems(Map<String, Integer> items) {
		this.items = items;
	}
}
