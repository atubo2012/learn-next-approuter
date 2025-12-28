'use server';

import { z } from 'zod';

import postgres from 'postgres';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';


//Define the schema for the form
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});
//Omit the id and date fields from the form
const Invoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

//Connect to the database
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });


//Create a new invoice
export async function createInvoice(formData: FormData) {
    //Parse the form data
    const { customerId, amount, status } = Invoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
  VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
`;
    //Refresh the client-side route cache and redirect the user to the invoices page
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
   
    const amountInCents = amount * 100;
   
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
   
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }

  export async function deleteInvoice(id: string) {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
  }