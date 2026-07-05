import React, { useEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

const AppToast = ({ open, message, severity = "error", onClose, duration = 4000 }) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = (_event, reason) => {
    if (reason === "clickaway") return;
    setIsOpen(false);
    onClose?.();
  };

  return (
    <Snackbar open={isOpen} autoHideDuration={duration} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AppToast;
