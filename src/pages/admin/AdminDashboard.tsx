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

const mockDealers = [
  { id: "1", name: "John Smith Auto", email: "john@smithauto.com", totalLoans: 24, activeLoans: 18 },
  { id: "2", name: "Elite Motors", email: "info@elitemotors.com", totalLoans: 32, activeLoans: 25 },
  { id: "3", name: "Prestige Autos", email: "sales@prestigeautos.com", totalLoans: 19, activeLoans: 12 },
  { id: "4", name: "City Car Center", email: "contact@citycar.com", totalLoans: 41, activeLoans: 30 },
  { id: "5", name: "Highway Motors", email: "support@highwaymotors.com", totalLoans: 15, activeLoans: 9 },
];

const mockLoans = [
  { id: "101", dealerId: "1", customerName: "Mike Johnson", amount: 25000, status: "Active", startDate: "2025-01-15", endDate: "2030-01-15" },
  { id: "102", dealerId: "2", customerName: "Lisa Brown", amount: 18500, status: "Active", startDate: "2025-02-10", endDate: "2028-02-10" },
  { id: "103", dealerId: "1", customerName: "David Wilson", amount: 32000, status: "Pending", startDate: "2025-03-01", endDate: "2030-03-01" },
];

const AdminDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [selectedDealerId, setSelectedDealerId] = useState<string | null>(null);

  const selectedDealer = mockDealers.find((dealer) => dealer.id === selectedDealerId);
  const filteredLoans = selectedDealerId ? mockLoans.filter((loan) => loan.dealerId === selectedDealerId) : [];

  return (
    <div>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Loan Management System
          </Typography>
          <Typography variant="body2" sx={{ marginRight: 2 }}>
            Welcome, {currentUser?.name} (Admin)
          </Typography>
          <Button variant="contained" color="error" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          Admin Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6">My Dealers</Typography>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Dealer Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Total Loans</TableCell>
                    <TableCell>Active Loans</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockDealers.map((dealer) => (
                    <TableRow
                      key={dealer.id}
                      hover
                      selected={selectedDealerId === dealer.id}
                      onClick={() => setSelectedDealerId(dealer.id)}
                      sx={{ cursor: "pointer", backgroundColor: selectedDealerId === dealer.id ? "rgba(0, 0, 255, 0.1)" : "inherit" }}
                    >
                      <TableCell>{dealer.name}</TableCell>
                      <TableCell>{dealer.email}</TableCell>
                      <TableCell>{dealer.totalLoans}</TableCell>
                      <TableCell>{dealer.activeLoans}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6">Dealer Details</Typography>
            <Paper sx={{ padding: 2, marginTop: 2 }}>
              {selectedDealer ? (
                <>
                  <Typography><strong>Name:</strong> {selectedDealer.name}</Typography>
                  <Typography><strong>Email:</strong> {selectedDealer.email}</Typography>
                  <Typography><strong>Total Loans:</strong> {selectedDealer.totalLoans}</Typography>
                  <Typography><strong>Active Loans:</strong> {selectedDealer.activeLoans}</Typography>
                  <Typography variant="h6" sx={{ marginTop: 2 }}>Loans</Typography>
                  {filteredLoans.length > 0 ? (
                    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Loan ID</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredLoans.map((loan) => (
                            <TableRow key={loan.id}>
                              <TableCell>{loan.id}</TableCell>
                              <TableCell>{loan.customerName}</TableCell>
                              <TableCell>${loan.amount.toLocaleString()}</TableCell>
                              <TableCell>
                                <Chip label={loan.status} size="small" color={loan.status === "Active" ? "success" : "warning"} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography color="textSecondary">No loans available</Typography>
                  )}
                </>
              ) : (
                <Typography color="textSecondary">Select a dealer to view details</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default AdminDashboard;
