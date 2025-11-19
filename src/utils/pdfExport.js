import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Format currency without symbol for better table alignment
const formatCurrency = (amount) => {
  return Number(amount).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Format currency with symbol for headers
const formatCurrencyFull = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amount);
};

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Add header to PDF
const addHeader = (doc, title, user) => {
  doc.setFillColor(99, 102, 241); // Indigo
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('FinanceTracker', 15, 18);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(title, 15, 28);
  
  doc.setFontSize(9);
  const date = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(`Generated: ${date}`, 150, 18);
  if (user) {
    doc.text(`User: ${user}`, 150, 26);
  }
  
  doc.setTextColor(0, 0, 0);
};

// Add footer to PDF
const addFooter = (doc, pageNumber) => {
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Page ${pageNumber} | FinanceTracker © ${new Date().getFullYear()}`,
    105,
    pageHeight - 10,
    { align: 'center' }
  );
};

// Export Expenses to PDF
export const exportExpensesPDF = (expenses, dateRange, userName) => {
  const doc = new jsPDF();
  
  // Header
  addHeader(doc, 'Expenses Report', userName);
  
  // Date Range Section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Report Period:', 15, 48);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`${formatDate(dateRange.start)} to ${formatDate(dateRange.end)}`, 15, 54);
  
  // Summary Statistics Box
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
  
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(15, 60, 180, 28, 2, 2, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary Statistics', 20, 68);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Total Expenses:`, 20, 75);
  doc.setFont('helvetica', 'bold');
  doc.text(`${formatCurrencyFull(totalExpenses)}`, 55, 75);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Transactions:`, 110, 75);
  doc.setFont('helvetica', 'bold');
  doc.text(`${expenses.length}`, 145, 75);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Average:`, 20, 82);
  doc.setFont('helvetica', 'bold');
  doc.text(`${formatCurrencyFull(avgExpense)}`, 55, 82);
  
  // Expenses Table
  const tableData = expenses.map(exp => [
    formatDate(exp.expenseDate || exp.date),
    (exp.category || '').charAt(0).toUpperCase() + (exp.category || '').slice(1),
    (exp.description || 'N/A').substring(0, 35),
    (exp.paymentMethod || 'N/A').substring(0, 15),
    `₦${formatCurrency(exp.amount)}`
  ]);
  
  autoTable(doc, {
    startY: 95,
    head: [['Date', 'Category', 'Description', 'Payment Method', 'Amount (₦)']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
      cellPadding: 4
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      valign: 'middle',
      overflow: 'linebreak',
      cellWidth: 'wrap'
    },
    columnStyles: {
      0: { cellWidth: 28, halign: 'center' },
      1: { cellWidth: 28, halign: 'left' },
      2: { cellWidth: 65, halign: 'left' },
      3: { cellWidth: 32, halign: 'center' },
      4: { cellWidth: 30, halign: 'right', fontStyle: 'bold' }
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251]
    },
    didDrawPage: (data) => {
      addFooter(doc, data.pageNumber);
    }
  });
  
  // Category Breakdown on new page if needed
  const finalY = doc.lastAutoTable.finalY || 95;
  
  if (finalY > 240) {
    doc.addPage();
    addHeader(doc, 'Expenses Report (Continued)', userName);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Breakdown by Category', 15, 50);
  } else {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Breakdown by Category', 15, finalY + 12);
  }
  
  const categoryTotals = {};
  expenses.forEach(exp => {
    const cat = exp.category || 'Other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + exp.amount;
  });
  
  const categoryData = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount]) => [
      category.charAt(0).toUpperCase() + category.slice(1),
      `₦${formatCurrency(amount)}`,
      `${((amount / totalExpenses) * 100).toFixed(1)}%`
    ]);
  
  autoTable(doc, {
    startY: finalY > 240 ? 58 : finalY + 18,
    head: [['Category', 'Total Amount (₦)', 'Percentage']],
    body: categoryData,
    theme: 'grid',
    headStyles: {
      fillColor: [243, 244, 246],
      textColor: [0, 0, 0],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center',
      cellPadding: 3
    },
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 80, halign: 'left', fontStyle: 'bold' },
      1: { cellWidth: 60, halign: 'right' },
      2: { cellWidth: 43, halign: 'center', fontStyle: 'bold', textColor: [99, 102, 241] }
    }
  });
  
  // Save PDF
  const filename = `Expenses_Report_${formatDate(dateRange.start).replace(/\s/g, '_')}.pdf`;
  doc.save(filename);
};

// Export Bills to PDF
export const exportBillsPDF = (bills, userName) => {
  const doc = new jsPDF();
  
  // Header
  addHeader(doc, 'Bills Report', userName);
  
  // Summary Statistics
  const totalBills = bills.length;
  const paidBills = bills.filter(b => b.status === 'paid').length;
  const pendingBills = bills.filter(b => b.status === 'pending').length;
  const overdueBills = bills.filter(b => b.status === 'overdue').length;
  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const paidAmount = bills.filter(b => b.status === 'paid').reduce((sum, bill) => sum + bill.amount, 0);
  const outstanding = totalAmount - paidAmount;
  
  // Summary Box
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(15, 48, 180, 38, 2, 2, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Bills Summary', 20, 56);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  // First row
  doc.text(`Total Bills:`, 20, 64);
  doc.setFont('helvetica', 'bold');
  doc.text(`${totalBills}`, 55, 64);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(34, 197, 94);
  doc.text(`Paid: ${paidBills}`, 80, 64);
  doc.setTextColor(251, 191, 36);
  doc.text(`Pending: ${pendingBills}`, 115, 64);
  doc.setTextColor(239, 68, 68);
  doc.text(`Overdue: ${overdueBills}`, 155, 64);
  doc.setTextColor(0, 0, 0);
  
  // Second row
  doc.text(`Total Amount:`, 20, 72);
  doc.setFont('helvetica', 'bold');
  doc.text(`${formatCurrencyFull(totalAmount)}`, 55, 72);
  
  // Third row
  doc.setFont('helvetica', 'normal');
  doc.text(`Paid:`, 20, 80);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 197, 94);
  doc.text(`${formatCurrencyFull(paidAmount)}`, 55, 80);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(`Outstanding:`, 110, 80);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(239, 68, 68);
  doc.text(`${formatCurrencyFull(outstanding)}`, 145, 80);
  doc.setTextColor(0, 0, 0);
  
  // Bills Table
  const tableData = bills.map(bill => {
    const status = (bill.status || 'pending').toUpperCase();
    return [
      (bill.name || bill.billName || 'N/A').substring(0, 40),
      `₦${formatCurrency(bill.amount)}`,
      formatDate(bill.dueDate),
      bill.recurring ? 'Yes' : 'No',
      status
    ];
  });
  
  autoTable(doc, {
    startY: 93,
    head: [['Bill Name', 'Amount (₦)', 'Due Date', 'Recurring', 'Status']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center',
      cellPadding: 4
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      valign: 'middle',
      overflow: 'linebreak'
    },
    columnStyles: {
      0: { cellWidth: 70, halign: 'left' },
      1: { cellWidth: 45, halign: 'right', fontStyle: 'bold' },
      2: { cellWidth: 35, halign: 'center' },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 23, halign: 'center', fontStyle: 'bold' }
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251]
    },
    didDrawCell: (data) => {
      // Color code status column
      if (data.column.index === 4 && data.row.section === 'body') {
        const status = data.cell.text[0];
        if (status === 'PAID') {
          data.cell.styles.textColor = [34, 197, 94]; // green
        } else if (status === 'OVERDUE') {
          data.cell.styles.textColor = [239, 68, 68]; // red
        } else if (status === 'PENDING') {
          data.cell.styles.textColor = [251, 191, 36]; // yellow
        }
      }
    },
    didDrawPage: (data) => {
      addFooter(doc, data.pageNumber);
    }
  });
  
  // Save PDF
  const filename = `Bills_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};

// Export Full Financial Report
export const exportFullReportPDF = (data, userName) => {
  const doc = new jsPDF();
  
  // Header
  addHeader(doc, 'Complete Financial Report', userName);
  
  const { expenses, bills, contributions, stats } = data;
  
  // Executive Summary Box
  doc.setFillColor(99, 102, 241);
  doc.roundedRect(15, 48, 180, 40, 2, 2, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', 20, 57);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  doc.text(`Balance:`, 20, 66);
  doc.setFont('helvetica', 'bold');
  doc.text(`${formatCurrencyFull(stats.balance)}`, 60, 66);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Contributions:`, 20, 74);
  doc.setFont('helvetica', 'bold');
  doc.text(`${formatCurrencyFull(stats.totalContributions)}`, 60, 74);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Expenses:`, 110, 66);
  doc.setFont('helvetica', 'bold');
  doc.text(`${formatCurrencyFull(stats.totalExpenses)}`, 145, 66);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Pending Bills:`, 110, 74);
  doc.setFont('helvetica', 'bold');
  doc.text(`${formatCurrencyFull(stats.pendingBills)}`, 145, 74);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Report Generated: ${new Date().toLocaleDateString('en-US')}`, 20, 82);
  
  doc.setTextColor(0, 0, 0);
  
  // Recent Contributions
  let yPos = 95;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Recent Contributions', 15, yPos);
  yPos += 3;
  
  const contributionsData = contributions.slice(0, 5).map(c => [
    formatDate(c.contributionDate || c.date),
    (c.source || c.contributor || 'N/A').substring(0, 30),
    (c.category || 'General').substring(0, 20),
    `₦${formatCurrency(c.amount)}`
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Date', 'Source', 'Category', 'Amount (₦)']],
    body: contributionsData.length > 0 ? contributionsData : [['No contributions found', '', '', '']],
    theme: 'grid',
    headStyles: { 
      fillColor: [34, 197, 94],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center',
      cellPadding: 3
    },
    styles: { 
      fontSize: 8,
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 28, halign: 'center' },
      1: { cellWidth: 70, halign: 'left' },
      2: { cellWidth: 40, halign: 'left' },
      3: { cellWidth: 35, halign: 'right', fontStyle: 'bold' }
    }
  });
  
  yPos = doc.lastAutoTable.finalY + 10;
  
  // Recent Expenses
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Recent Expenses', 15, yPos);
  yPos += 3;
  
  const expensesData = expenses.slice(0, 5).map(e => [
    formatDate(e.expenseDate || e.date),
    (e.category || 'Other').charAt(0).toUpperCase() + (e.category || 'Other').slice(1),
    (e.description || 'N/A').substring(0, 30),
    `₦${formatCurrency(e.amount)}`
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Date', 'Category', 'Description', 'Amount (₦)']],
    body: expensesData.length > 0 ? expensesData : [['No expenses found', '', '', '']],
    theme: 'grid',
    headStyles: { 
      fillColor: [239, 68, 68],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center',
      cellPadding: 3
    },
    styles: { 
      fontSize: 8,
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 28, halign: 'center' },
      1: { cellWidth: 35, halign: 'left' },
      2: { cellWidth: 75, halign: 'left' },
      3: { cellWidth: 35, halign: 'right', fontStyle: 'bold' }
    }
  });
  
  // New page for bills
  doc.addPage();
  addHeader(doc, 'Complete Financial Report (Continued)', userName);
  
  yPos = 50;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Bills Overview', 15, yPos);
  yPos += 3;
  
  const billsData = bills.slice(0, 10).map(b => [
    (b.name || b.billName || 'N/A').substring(0, 40),
    `₦${formatCurrency(b.amount)}`,
    formatDate(b.dueDate),
    (b.status || 'pending').toUpperCase()
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Bill Name', 'Amount (₦)', 'Due Date', 'Status']],
    body: billsData.length > 0 ? billsData : [['No bills found', '', '', '']],
    theme: 'grid',
    headStyles: { 
      fillColor: [234, 179, 8],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center',
      cellPadding: 3
    },
    styles: { 
      fontSize: 8,
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 85, halign: 'left' },
      1: { cellWidth: 35, halign: 'right', fontStyle: 'bold' },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 23, halign: 'center', fontStyle: 'bold' }
    },
    didDrawCell: (data) => {
      if (data.column.index === 3 && data.row.section === 'body') {
        const status = data.cell.text[0];
        if (status === 'PAID') {
          data.cell.styles.textColor = [34, 197, 94];
        } else if (status === 'OVERDUE') {
          data.cell.styles.textColor = [239, 68, 68];
        } else if (status === 'PENDING') {
          data.cell.styles.textColor = [251, 191, 36];
        }
      }
    },
    didDrawPage: (data) => {
      addFooter(doc, data.pageNumber);
    }
  });
  
  // Save PDF
  const filename = `Financial_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};