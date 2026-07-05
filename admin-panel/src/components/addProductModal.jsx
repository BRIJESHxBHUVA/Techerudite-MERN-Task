import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const initialForm = {
  name: "",
  description: "",
  quantity: "",
  categories: [],
};

const AddProductModal = ({ open, onClose, categories = [], onSubmit, loading = false }) => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) {
      setFormData(initialForm);
      setErrors({});
    }
  }, [open]);

  const validateForm = () => {
    const upComingError = {};
    const productName = formData.name.trim();

    if (!productName) {
      upComingError.name = "Product name is required.";
    } else if (!/^[A-Za-z0-9\s-]+$/.test(productName)) {
      upComingError.name = "Only letters, numbers, spaces, and hyphens are allowed.";
    }

    if (!formData.quantity) {
      upComingError.quantity = "Quantity is required.";
    } else if (Number(formData.quantity) <= 0) {
      upComingError.quantity = "Quantity must be greater than 0.";
    }

    if (!formData.categories.length) {
      upComingError.categories = "Please select at least one category.";
    }

    setErrors(upComingError);
    return Object.keys(upComingError).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, categories: typeof value === "string" ? value.split(",") : value }));
    setErrors((prev) => ({ ...prev, categories: "" }));
  };

  const handleRemoveCategory = (categoryId) => (event) => {
    event?.stopPropagation();
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((item) => item !== categoryId),
    }));
    setErrors((prev) => ({ ...prev, categories: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      quantity: Number(formData.quantity),
      categories: formData.categories,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Product</DialogTitle>
      <DialogContent>
        <Box component="form" id="add-product-form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Product name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={Boolean(errors.name)}
            helperText={errors.name}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            placeholder="Optional"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            error={Boolean(errors.quantity)}
            helperText={errors.quantity}
            sx={{ mb: 2 }}
          />

          <Select
            fullWidth
            multiple
            displayEmpty
            value={formData.categories}
            onChange={handleCategoryChange}
            renderValue={(selected) => {
              if (!selected.length) {
                return <Typography sx={{ color: "#8893a7" }}>Select categories</Typography>;
              }
              return (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((categoryId) => {
                    const option = categories.find((item) => (item._id || item.name) === categoryId);
                    return (
                      <Chip
                        key={categoryId}
                        label={option?.name || categoryId}
                        size="small"
                        onMouseDown={(event) => event.stopPropagation()}
                        onDelete={handleRemoveCategory(categoryId)}
                      />
                    );
                  })}
                </Box>
              );
            }}
            error={Boolean(errors.categories)}
          >
            {categories.map((option) => {
              const optionValue = option._id || option.name;
              return (
                <MenuItem key={optionValue} value={optionValue}>
                  {option.name}
                </MenuItem>
              );
            })}
          </Select>
          {errors.categories && (
            <Typography color="error" variant="caption" sx={{ display: "block", mt: 0.5 }}>
              {errors.categories}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button type="submit" form="add-product-form" variant="contained" disabled={loading}>
          {loading ? "Saving..." : "Add Product"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductModal;
