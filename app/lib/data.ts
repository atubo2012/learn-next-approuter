import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  Invoice,
} from './definitions';
import { formatCurrency } from './utils';
import { customers, invoices, revenue } from './placeholder-data';

export async function fetchRevenue() {
  try {
    return revenue;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const latestInvoices = invoices
      .map((invoice) => {
        const customer = customers.find((c) => c.id === invoice.customer_id);
        return {
          ...invoice,
          name: customer?.name ?? 'Unknown',
          image_url: customer?.image_url ?? '',
          email: customer?.email ?? '',
          amount: formatCurrency(invoice.amount),
        };
      })
      .slice(0, 5);
    return latestInvoices;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    const numberOfInvoices = invoices.length;
    const numberOfCustomers = customers.length;
    const totalPaidInvoices = formatCurrency(
      invoices
        .filter((invoice) => invoice.status === 'paid')
        .reduce((sum, invoice) => sum + invoice.amount, 0)
    );
    const totalPendingInvoices = formatCurrency(
      invoices
        .filter((invoice) => invoice.status === 'pending')
        .reduce((sum, invoice) => sum + invoice.amount, 0)
    );

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const filteredInvoices = invoices
      .filter((invoice) => {
        const customer = customers.find((c) => c.id === invoice.customer_id);
        if (!customer) return false;
        const searchable = `${customer.name} ${customer.email} ${invoice.amount} ${invoice.date} ${invoice.status}`.toLowerCase();
        return searchable.includes(query.toLowerCase());
      })
      .slice(offset, offset + ITEMS_PER_PAGE)
      .map((invoice) => {
        const customer = customers.find((c) => c.id === invoice.customer_id);
        return {
          ...invoice,
          name: customer?.name ?? 'Unknown',
          email: customer?.email ?? '',
          image_url: customer?.image_url ?? '',
        };
      });

    return filteredInvoices;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const filteredInvoices = invoices.filter((invoice) => {
      const customer = customers.find((c) => c.id === invoice.customer_id);
      if (!customer) return false;
      const searchable = `${customer.name} ${customer.email} ${invoice.amount} ${invoice.date} ${invoice.status}`.toLowerCase();
      return searchable.includes(query.toLowerCase());
    });
    return Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const invoice = (invoices as Invoice[]).find((inv) => inv.id === id);
    if (!invoice) throw new Error('Invoice not found');
    return {
      ...invoice,
      amount: invoice.amount / 100,
    };
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    return customers.map(({ id, name }) => ({ id, name }));
  } catch (err) {
    console.error('Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    return customers
      .filter((customer) => {
        const searchable = `${customer.name} ${customer.email}`.toLowerCase();
        return searchable.includes(query.toLowerCase());
      })
      .map((customer) => {
        const customerInvoices = invoices.filter(
          (inv) => inv.customer_id === customer.id
        );
        const total_pending = formatCurrency(
          customerInvoices
            .filter((inv) => inv.status === 'pending')
            .reduce((sum, inv) => sum + inv.amount, 0)
        );
        const total_paid = formatCurrency(
          customerInvoices
            .filter((inv) => inv.status === 'paid')
            .reduce((sum, inv) => sum + inv.amount, 0)
        );
        return {
          ...customer,
          total_invoices: customerInvoices.length,
          total_pending,
          total_paid,
        };
      });
  } catch (err) {
    console.error('Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
