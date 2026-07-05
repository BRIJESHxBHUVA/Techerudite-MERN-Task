import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { HeaderLogo, PlusIcon, CrossIcon, DeleteIcon } from "../../utils/svg";
import { addProduct, deleteProduct, getProducts } from "../../redux/slice/productSlice";
import { useDebounce } from "../../utils/useDebounce";
import { getCategories } from "../../redux/slice/categorySlice";
import ConfirmationModal from "../../components/confirmationModal";
import AddProductModal from "../../components/addProductModal";
import AppToast from "../../components/appToast";

const HomePage = () => {
  const dispatch = useDispatch();
  const {
    products = [],
    totalProducts,
    totalPages,
    loading,
    error,
  } = useSelector((state) => state.product);
  const { categories = [] } = useSelector((state) => state.category);

  const [searchValue, setSearchValue] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastState, setToastState] = useState({ open: false, message: "", severity: "error" });

  const debouncedSearchValue = useDebounce(searchValue, 500);

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  useEffect(() => {
    const query = {
      page: page + 1,
      limit: rowsPerPage,
    };
    if (debouncedSearchValue) query.search = debouncedSearchValue;
    if (selectedCategories.length) query.categories = selectedCategories;

    dispatch(getProducts(query));
  }, [rowsPerPage, page, debouncedSearchValue, selectedCategories, dispatch]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearchValue, selectedCategories]);

  useEffect(() => {
    if (totalPages > 0 && page >= totalPages) {
      setPage(totalPages - 1);
    }
  }, [page, totalPages]);

  const handleRowPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const categoryOptions = useMemo(() => {
    if (Array.isArray(categories)) return categories;
    if (Array.isArray(categories?.categories)) return categories.categories;
    return [];
  }, [categories]);

  const pageNumbers = useMemo(() => {
    if (!totalPages || totalPages <= 0) return [1];
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [totalPages]);

  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const startItem = totalProducts ? page * rowsPerPage + 1 : 0;
  const endItem = Math.min((page + 1) * rowsPerPage, totalProducts || 0);

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategories(typeof value === "string" ? value.split(",") : value);
  };

  const handleRemoveCategory = (categoryId) => {
    setSelectedCategories((prev) => prev.filter((item) => item !== categoryId));
  };

  const handleClearSearch = () => {
    setSearchValue("");
  };

  const handleOpenDeleteModal = (productId) => {
    setSelectedProductId(productId);
    setOpenConfirmationModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenConfirmationModal(false);
    setSelectedProductId(null);
  };

  const handleDeleteProduct = async () => {
    if (!selectedProductId || isDeleting) return;

    setIsDeleting(true);
    const result = await dispatch(deleteProduct(selectedProductId));

    if (deleteProduct.fulfilled.match(result)) {
      setPage(0);
      dispatch(getProducts({ page: 1, limit: rowsPerPage }));
    } else {
      setToastState({
        open: true,
        message: result.payload?.message || "Unable to delete product right now.",
        severity: "error",
      });
    }

    handleCloseDeleteModal();
    setIsDeleting(false);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const handleAddProductSubmit = async (payload) => {
    const result = await dispatch(addProduct(payload));
    if (addProduct.fulfilled.match(result)) {
      dispatch(getProducts({ page: 1, limit: rowsPerPage }));
      handleCloseAddModal();
    } else {
      setToastState({
        open: true,
        message: result.payload?.message || "Unable to add product right now.",
        severity: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="overflow-hidden rounded-[24px] bg-gradient-to-r from-[#1f4e8c] via-[#2f61ae] to-[#3f7fd0] shadow-[0_18px_45px_rgba(31,78,140,0.25)]">
          <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/15 p-2 backdrop-blur">
                <HeaderLogo />
              </div>
            </div>
            <Button
              variant="contained"
              startIcon={<PlusIcon />}
              onClick={()=> setOpenAddModal(true)}
              sx={{
                bgcolor: "#fff",
                color: "#d33a3a",
                px: 2.5,
                py: 1.1,
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 700,
                boxShadow: "none",
                "&:hover": { bgcolor: "#f6f8fb", boxShadow: "none" },
              }}
            >
              Add Product
            </Button>
          </div>
        </header>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            border: "1px solid #e8eef8",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            justifycontent="space-between"
            alignitems={{ xs: "stretch", md: "center" }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ width: { xs: "100%", md: "auto" } }}
            >
              <TextField
                size="small"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search product"
                slotProps={{
                  input: {
                    endAdornment: searchValue ? (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={handleClearSearch}
                        >
                          <CrossIcon />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  },
                }}
                sx={{
                  minWidth: 260,
                  "& .MuiOutlinedInput-root": {
                    height: 44,
                    borderRadius: 2,
                  },
                }}
              />
              <Select
                multiple
                size="small"
                value={selectedCategories}
                displayEmpty
                onChange={handleCategoryChange}
                renderValue={(selected) => {
                  if (!selected.length) {
                    return (
                      <Typography sx={{ color: "#8893a7" }}>
                        Filter by category
                      </Typography>
                    );
                  }

                  return (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((categoryId) => {
                        const option = categoryOptions.find(
                          (item) => (item._id || item.name) === categoryId,
                        );
                        return (
                          <Chip
                            key={categoryId}
                            label={option?.name || categoryId}
                            size="small"
                            onMouseDown={(e) => e.stopPropagation()}
                            onDelete={() => handleRemoveCategory(categoryId)}
                            deleteIcon={
                              <span>
                                <CrossIcon />
                              </span>
                            }
                            sx={{ fontWeight: 600 }}
                          />
                        );
                      })}
                    </Box>
                  );
                }}
                sx={{
                  minWidth: 260,
                  "& .MuiOutlinedInput-root": {
                    height: 44,
                    borderRadius: 2,
                  },
                }}
              >
                {categoryOptions.map((option) => {
                  const optionValue = option._id || option.name;
                  return (
                    <MenuItem key={optionValue} value={optionValue}>
                      {option.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </Stack>
          </Stack>

          <TableContainer
            sx={{
              mt: 3,
              borderRadius: 2,
              border: "1px solid #edf2f9",
              maxHeight: { xs: 400, md: 550 },
              overflow: "auto",
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 8,
                }}
              >
                <CircularProgress size={28} />
              </Box>
            ) : products.length === 0 ? (
              <Box sx={{ py: 8, textAlign: "center" }}>
                <Typography
                  variant="h6"
                  sx={{ color: "#12233d", fontWeight: 600 }}
                >
                  No products match your filters.
                </Typography>
                <Typography variant="body2" sx={{ color: "#5b6b86", mt: 1 }}>
                  Try another search term or category selection.
                </Typography>
              </Box>
            ) : (
              <>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: "#12233d" }}>
                        No.
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#12233d" }}>
                        Product
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#12233d" }}>
                        Category
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#12233d" }}>
                        Stock
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#12233d" }}>
                        Status
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#12233d" }}>
                        Added On
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#12233d" }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product, index) => {
                      const quantity = Number(product.quantity || 0);
                      const status = quantity > 20 ? "In stock" : "Low stock";
                      const productCategories = product.categories || [];
                      const rowIndex = page * rowsPerPage + index + 1;

                      return (
                        <TableRow key={product._id || product.name} hover>
                          <TableCell>
                            <Typography
                              sx={{ fontWeight: 600, color: "#12233d" }}
                            >
                              {rowIndex}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography
                                sx={{ fontWeight: 600, color: "#12233d" }}
                              >
                                {product.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "#5b6b86", mt: 0.3 }}
                              >
                                {product.description ||
                                  "No description provided."}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {productCategories.map((cat) => (
                              <Chip
                                key={cat._id}
                                label={cat.name}
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </TableCell>
                          <TableCell>{quantity}</TableCell>
                          <TableCell>
                            <Chip
                              label={status}
                              size="small"
                              sx={{
                                bgcolor: quantity > 20 ? "#e8f7ee" : "#fff4e5",
                                color: quantity > 20 ? "#1f8a4c" : "#c97a00",
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: "#5b6b86" }}>
                              {formatDate(product.createdAt)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Button
                              color="error"
                              variant="outlined"
                              size="small"
                              onClick={() => handleOpenDeleteModal(product._id)}
                              startIcon={<DeleteIcon />}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </>
            )}
          </TableContainer>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
            sx={{
              px: 2,
              py: 2,
              borderTop: "1px solid #edf2f9",
              backgroundColor: "#fff",
            }}
          >
            <Typography variant="body2" sx={{ color: "#5b6b86" }}>
              Showing {startItem}-{endItem} of {totalProducts || 0} products
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
              {pageNumbers.map((pageNumber) => (
                <Button
                  key={pageNumber}
                  size="small"
                  variant={pageNumber - 1 === page ? "contained" : "outlined"}
                  onClick={() => setPage(pageNumber - 1)}
                  sx={
                    pageNumber - 1 === page
                      ? {
                          bgcolor: "#1f4e8c",
                          color: "#fff",
                          "&:hover": { bgcolor: "#183d70" },
                        }
                      : undefined
                  }
                >
                  {pageNumber}
                </Button>
              ))}
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" sx={{ color: "#5b6b86" }}>
                Rows per page
              </Typography>
              <Select size="small" value={rowsPerPage} onChange={handleRowPerPageChange}>
                {[5, 10, 25].map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </Stack>
        </Paper>

        <ConfirmationModal
          open={openConfirmationModal}
          title="Delete product"
          message="Are you sure you want to delete this product? This action cannot be undone."
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteProduct}
          confirmText="Delete"
          loading={isDeleting}
        />

        <AddProductModal
          open={openAddModal}
          onClose={handleCloseAddModal}
          categories={categoryOptions}
          loading={loading}
          onSubmit={handleAddProductSubmit}
        />

        <AppToast
          open={toastState.open}
          message={toastState.message}
          severity={toastState.severity}
          onClose={() => setToastState((prev) => ({ ...prev, open: false }))}
        />
      </div>
    </div>
  );
};

export default HomePage;
