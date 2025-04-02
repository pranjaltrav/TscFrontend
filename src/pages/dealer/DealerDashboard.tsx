import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";

const mockDealerLoans = [
  { id: "101", customerName: "Mike Johnson", vehicleModel: "Toyota Camry", amount: 25000, status: "Active", startDate: "2025-01-15", endDate: "2030-01-15", interestRate: 4.5, monthlyPayment: 466.08 },
  { id: "103", customerName: "David Wilson", vehicleModel: "Honda Accord", amount: 32000, status: "Pending", startDate: "2025-03-01", endDate: "2030-03-01", interestRate: 4.2, monthlyPayment: 591.17 },
  { id: "108", customerName: "Jennifer Garcia", vehicleModel: "Nissan Altima", amount: 27000, status: "Active", startDate: "2025-02-15", endDate: "2030-02-15", interestRate: 4.3, monthlyPayment: 502.38 },
  { id: "112", customerName: "Thomas Lee", vehicleModel: "Ford Escape", amount: 23500, status: "Active", startDate: "2025-01-05", endDate: "2029-01-05", interestRate: 4.7, monthlyPayment: 442.3 },
  { id: "118", customerName: "Jessica White", vehicleModel: "Hyundai Tucson", amount: 26500, status: "Completed", startDate: "2024-06-10", endDate: "2024-12-10", interestRate: 4.1, monthlyPayment: 494.12 },
];

const DealerDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);

  const selectedLoan = mockDealerLoans.find((loan) => loan.id === selectedLoanId);

  return (
    <div>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Loan Management System
          </Typography>
          <Typography variant="body2" sx={{ marginRight: 2 }}>
            Welcome, {currentUser?.name} (Dealer)
          </Typography>
          <Button variant="contained" color="error" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          Dealer Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6">Your Loans</Typography>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Vehicle</TableCell>
                    <TableCell>Term</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockDealerLoans.map((loan) => (
                    <TableRow
                      key={loan.id}
                      hover
                      selected={selectedLoanId === loan.id}
                      onClick={() => setSelectedLoanId(loan.id)}
                      sx={{
                        cursor: "pointer",
                        backgroundColor: selectedLoanId === loan.id ? "rgba(0, 0, 255, 0.1)" : "inherit",
                      }}
                    >
                      <TableCell>{loan.customerName}</TableCell>
                      <TableCell>
                        <Chip
                          label={loan.status}
                          size="small"
                          color={
                            loan.status === "Active" ? "success" : loan.status === "Pending" ? "warning" : "default"
                          }
                        />
                      </TableCell>
                      <TableCell>${loan.amount.toLocaleString()}</TableCell>
                      <TableCell>{loan.vehicleModel}</TableCell>
                      <TableCell>
                        {loan.startDate} to {loan.endDate}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6">Loan Details</Typography>
            <Paper sx={{ padding: 2, marginTop: 2 }}>
              {selectedLoan ? (
                <>
                  <Typography>
                    <strong>Loan ID:</strong> {selectedLoan.id}
                  </Typography>
                  <Typography>
                    <strong>Customer:</strong> {selectedLoan.customerName}
                  </Typography>
                  <Typography>
                    <strong>Vehicle:</strong> {selectedLoan.vehicleModel}
                  </Typography>
                  <Typography>
                    <strong>Amount:</strong> ${selectedLoan.amount.toLocaleString()}
                  </Typography>
                  <Typography>
                    <strong>Interest Rate:</strong> {selectedLoan.interestRate}%
                  </Typography>
                  <Typography>
                    <strong>Monthly Payment:</strong> ${selectedLoan.monthlyPayment.toLocaleString()}
                  </Typography>
                  <Typography>
                    <strong>Term:</strong> {selectedLoan.startDate} to {selectedLoan.endDate}
                  </Typography>
                  <Typography>
                    <strong>Status:</strong>{" "}
                    <Chip
                      label={selectedLoan.status}
                      size="small"
                      color={
                        selectedLoan.status === "Active"
                          ? "success"
                          : selectedLoan.status === "Pending"
                          ? "warning"
                          : "default"
                      }
                    />
                  </Typography>
                </>
              ) : (
                <Typography color="textSecondary">Select a loan to view details</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default DealerDashboard;
