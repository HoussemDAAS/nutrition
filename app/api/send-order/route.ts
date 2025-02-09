/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { urlFor } from '@/sanity/lib/image';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    
        console.log("Product images:", orderData.items.map((item: any) => ({
       
      // images: item.product.images,
      // url: item.product.images?.[0] ? urlFor(item.product.images[0]).url() : null,
      slug: item.product.slug,
    })));
    // Send email to admin
    const { data, error } = await resend.emails.send({
      from: 'orders@house-protein.tn',
      to: "akram_comptefb2@yahoo.fr",
      subject: `Nouvelle commande - ${orderData.reference}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <img src="https://house-protein.tn/logo.png" alt="House Protein Logo" style="max-width: 200px; margin-bottom: 20px;">
          <h1 style="color: #2d3748;">Nouvelle commande reçue</h1>
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px;">
            <h2 style="color: #4a5568;">Référence: ${orderData.reference}</h2>
            <h3 style="color: #4a5568;">Détails client:</h3>
            <p>Nom: ${orderData.customer.firstName} ${orderData.customer.lastName}</p>
            <p>Email: ${orderData.customer.email}</p>
            <p>Téléphone: ${orderData.customer.phone}</p>
            <p>Adresse: ${orderData.customer.address}, ${orderData.customer.city}</p>
          </div>
          
          <div style="margin-top: 20px; background: #f7fafc; padding: 20px; border-radius: 8px;">
            <h3 style="color: #4a5568;">Articles commandés:</h3>
            <ul style="list-style: none; padding: 0;">
              ${orderData.items.map((item: any) => `
                <li style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
            <a href="https://house-protein.tn/product/${item.product.slug?.current}" 
   style="color: inherit; text-decoration: none; display: flex; align-items: center; gap: 15px;">
 ${item.product.images?.length > 0 ? `
                      <img src="${urlFor(item.product.images[0]).width(200).url()}" 
                        alt="${item.product.nom}" 
                        style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;"
                      />
                    ` : `
                      <div style="width: 60px; height: 60px; background: #f0f0f0; border-radius: 4px;"></div>
                    `}

                    <div>
                      <strong>${item.product.nom}</strong> (${item.gout})<br>
                      Quantité: ${item.quantity}<br>
                      Prix: ${item.price} TND
                    </div>
                  </a>
                </li>
              `).join('')}
            </ul>
          </div>
          
          <p style="margin-top: 20px; font-size: 1.2em; color: #2d3748;">
            <strong>Total: ${orderData.total} TND</strong>
          </p>
        </div>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
    // console.log("Product images:", orderData.items.map(item => ({
    //   images: item.product.images,
    //   url: item.product.images?.[0] ? urlFor(item.product.images[0]).url() : null
    // })));
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: "Failed to process order" },
      { status: 500 }
    );
  }
}// <img src="${ item.product.images && item.product.images.length > 0  ? (item.product.images[0]).url()  : 'https://via.placeholder.com/60x60'}"     alt="${item.product.nom}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">