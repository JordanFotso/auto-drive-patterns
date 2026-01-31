// Builder Pattern: Document generation for orders

import { Order, CartItem } from '@/types/vehicle';

export interface OrderDocument {
  type: 'registration' | 'certificate' | 'order';
  title: string;
  content: string;
  format: 'pdf' | 'html';
  generatedAt: Date;
}

// Abstract Builder interface
export interface DocumentBuilder {
  reset(): void;
  setOrder(order: Order): void;
  buildHeader(): void;
  buildClientInfo(): void;
  buildVehicleDetails(): void;
  buildPricing(): void;
  buildFooter(): void;
  getResult(): OrderDocument;
}

// Helper to format price
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(price);
};

// Helper to format date
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

// Concrete Builder: HTML Registration Request
export class HTMLRegistrationBuilder implements DocumentBuilder {
  private order!: Order;
  private content: string = '';
  
  reset(): void {
    this.content = '';
  }
  
  setOrder(order: Order): void {
    this.order = order;
    this.reset();
  }
  
  buildHeader(): void {
    this.content += `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Demande d'Immatriculation - ${this.order.id}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #1a1a1a; }
    .header { text-align: center; border-bottom: 3px solid #c9a227; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: bold; color: #c9a227; }
    .document-title { font-size: 22px; margin-top: 15px; color: #333; }
    .section { margin: 25px 0; padding: 20px; background: #f8f8f8; border-radius: 8px; }
    .section-title { font-size: 16px; font-weight: bold; color: #c9a227; margin-bottom: 15px; text-transform: uppercase; }
    .field { margin: 10px 0; display: flex; }
    .field-label { font-weight: 600; width: 200px; color: #666; }
    .field-value { color: #1a1a1a; }
    .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #888; }
    .signature-box { margin-top: 40px; border: 1px dashed #ccc; padding: 30px; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">AutoÉlite</div>
    <div class="document-title">Demande d'Immatriculation</div>
    <div style="font-size: 14px; color: #666; margin-top: 10px;">Référence: ${this.order.id}</div>
  </div>
`;
  }
  
  buildClientInfo(): void {
    this.content += `
  <div class="section">
    <div class="section-title">Informations du Demandeur</div>
    <div class="field">
      <span class="field-label">Date de la demande:</span>
      <span class="field-value">${formatDate(this.order.createdAt)}</span>
    </div>
    <div class="field">
      <span class="field-label">Pays de livraison:</span>
      <span class="field-value">${this.order.country}</span>
    </div>
    <div class="field">
      <span class="field-label">Mode de paiement:</span>
      <span class="field-value">${this.order.paymentMethod === 'cash' ? 'Comptant' : 'Crédit'}</span>
    </div>
  </div>
`;
  }
  
  buildVehicleDetails(): void {
    this.content += `
  <div class="section">
    <div class="section-title">Véhicule(s) à Immatriculer</div>
`;
    this.order.items.forEach((item, index) => {
      this.content += `
    <div style="margin-bottom: 20px; ${index > 0 ? 'border-top: 1px solid #ddd; padding-top: 20px;' : ''}">
      <div class="field">
        <span class="field-label">Véhicule:</span>
        <span class="field-value">${item.vehicule.brand} ${item.vehicule.name}</span>
      </div>
      <div class="field">
        <span class="field-label">Modèle:</span>
        <span class="field-value">${item.vehicule.model} (${item.vehicule.year})</span>
      </div>
      <div class="field">
        <span class="field-label">Type:</span>
        <span class="field-value">${item.vehicule.type === 'automobile' ? 'Automobile' : 'Scooter'}</span>
      </div>
      <div class="field">
        <span class="field-label">Motorisation:</span>
        <span class="field-value">${item.vehicule.specifications.engine}</span>
      </div>
      <div class="field">
        <span class="field-label">Puissance:</span>
        <span class="field-value">${item.vehicule.specifications.power}</span>
      </div>
    </div>
`;
    });
    this.content += `  </div>`;
  }
  
  buildPricing(): void {
    // Not needed for registration document
  }
  
  buildFooter(): void {
    this.content += `
  <div class="signature-box">
    <p style="margin-bottom: 30px;">Signature du demandeur</p>
    <div style="border-bottom: 1px solid #333; width: 300px; margin: 0 auto;"></div>
    <p style="margin-top: 10px; font-size: 12px; color: #666;">Date: _______________</p>
  </div>
  <div class="footer">
    <p>AutoÉlite - Véhicules d'Exception</p>
    <p>Document généré le ${formatDate(new Date())}</p>
  </div>
</body>
</html>
`;
  }
  
  getResult(): OrderDocument {
    return {
      type: 'registration',
      title: `Demande d'Immatriculation - ${this.order.id}`,
      content: this.content,
      format: 'html',
      generatedAt: new Date(),
    };
  }
}

// Concrete Builder: HTML Certificate of Transfer
export class HTMLCertificateBuilder implements DocumentBuilder {
  private order!: Order;
  private content: string = '';
  
  reset(): void {
    this.content = '';
  }
  
  setOrder(order: Order): void {
    this.order = order;
    this.reset();
  }
  
  buildHeader(): void {
    this.content += `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Certificat de Cession - ${this.order.id}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #1a1a1a; }
    .header { text-align: center; border-bottom: 3px solid #c9a227; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: bold; color: #c9a227; }
    .document-title { font-size: 22px; margin-top: 15px; color: #333; }
    .official { background: #f0f0f0; padding: 10px; text-align: center; font-weight: bold; color: #666; margin-top: 10px; }
    .section { margin: 25px 0; padding: 20px; background: #f8f8f8; border-radius: 8px; }
    .section-title { font-size: 16px; font-weight: bold; color: #c9a227; margin-bottom: 15px; text-transform: uppercase; }
    .field { margin: 10px 0; display: flex; }
    .field-label { font-weight: 600; width: 200px; color: #666; }
    .field-value { color: #1a1a1a; }
    .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #888; }
    .dual-signature { display: flex; justify-content: space-around; margin-top: 40px; }
    .signature-box { border: 1px dashed #ccc; padding: 30px; text-align: center; width: 40%; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">AutoÉlite</div>
    <div class="document-title">Certificat de Cession</div>
    <div class="official">DOCUMENT OFFICIEL DE TRANSFERT DE PROPRIÉTÉ</div>
  </div>
`;
  }
  
  buildClientInfo(): void {
    this.content += `
  <div class="section">
    <div class="section-title">Parties Concernées</div>
    <div style="display: flex; gap: 40px;">
      <div style="flex: 1;">
        <h4 style="color: #c9a227; margin-bottom: 10px;">Vendeur</h4>
        <div class="field">
          <span class="field-label">Société:</span>
          <span class="field-value">AutoÉlite SAS</span>
        </div>
        <div class="field">
          <span class="field-label">SIRET:</span>
          <span class="field-value">XXX XXX XXX XXXXX</span>
        </div>
      </div>
      <div style="flex: 1;">
        <h4 style="color: #c9a227; margin-bottom: 10px;">Acquéreur</h4>
        <div class="field">
          <span class="field-label">Référence:</span>
          <span class="field-value">${this.order.id}</span>
        </div>
        <div class="field">
          <span class="field-label">Pays:</span>
          <span class="field-value">${this.order.country}</span>
        </div>
      </div>
    </div>
  </div>
`;
  }
  
  buildVehicleDetails(): void {
    this.content += `
  <div class="section">
    <div class="section-title">Véhicule(s) Cédé(s)</div>
`;
    this.order.items.forEach((item) => {
      this.content += `
    <div style="margin-bottom: 15px; padding: 15px; background: white; border-radius: 4px;">
      <div class="field">
        <span class="field-label">Désignation:</span>
        <span class="field-value"><strong>${item.vehicule.brand} ${item.vehicule.name}</strong></span>
      </div>
      <div class="field">
        <span class="field-label">Modèle / Année:</span>
        <span class="field-value">${item.vehicule.model} / ${item.vehicule.year}</span>
      </div>
      <div class="field">
        <span class="field-label">Catégorie:</span>
        <span class="field-value">${item.vehicule.type === 'automobile' ? 'Véhicule Particulier' : 'Deux-Roues'}</span>
      </div>
    </div>
`;
    });
    this.content += `  </div>`;
  }
  
  buildPricing(): void {
    this.content += `
  <div class="section">
    <div class="section-title">Conditions Financières</div>
    <div class="field">
      <span class="field-label">Montant HT:</span>
      <span class="field-value">${formatPrice(this.order.totalAmount - this.order.taxAmount)}</span>
    </div>
    <div class="field">
      <span class="field-label">Taxes:</span>
      <span class="field-value">${formatPrice(this.order.taxAmount)}</span>
    </div>
    <div class="field">
      <span class="field-label" style="font-weight: bold;">Montant TTC:</span>
      <span class="field-value" style="font-weight: bold; font-size: 18px;">${formatPrice(this.order.totalAmount)}</span>
    </div>
    <div class="field">
      <span class="field-label">Règlement:</span>
      <span class="field-value">${this.order.paymentMethod === 'cash' ? 'Comptant' : 'Financement'}</span>
    </div>
  </div>
`;
  }
  
  buildFooter(): void {
    this.content += `
  <div class="dual-signature">
    <div class="signature-box">
      <p style="margin-bottom: 30px;">Le Vendeur</p>
      <div style="border-bottom: 1px solid #333; width: 80%; margin: 0 auto;"></div>
      <p style="margin-top: 10px; font-size: 12px;">AutoÉlite SAS</p>
    </div>
    <div class="signature-box">
      <p style="margin-bottom: 30px;">L'Acquéreur</p>
      <div style="border-bottom: 1px solid #333; width: 80%; margin: 0 auto;"></div>
      <p style="margin-top: 10px; font-size: 12px;">Signature précédée de "Lu et approuvé"</p>
    </div>
  </div>
  <div class="footer">
    <p>Ce certificat atteste du transfert de propriété du véhicule mentionné ci-dessus.</p>
    <p>Document généré le ${formatDate(new Date())}</p>
  </div>
</body>
</html>
`;
  }
  
  getResult(): OrderDocument {
    return {
      type: 'certificate',
      title: `Certificat de Cession - ${this.order.id}`,
      content: this.content,
      format: 'html',
      generatedAt: new Date(),
    };
  }
}

// Concrete Builder: HTML Order Form
export class HTMLOrderBuilder implements DocumentBuilder {
  private order!: Order;
  private content: string = '';
  
  reset(): void {
    this.content = '';
  }
  
  setOrder(order: Order): void {
    this.order = order;
    this.reset();
  }
  
  buildHeader(): void {
    this.content += `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Bon de Commande - ${this.order.id}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #1a1a1a; }
    .header { text-align: center; border-bottom: 3px solid #c9a227; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: bold; color: #c9a227; }
    .document-title { font-size: 22px; margin-top: 15px; color: #333; }
    .order-ref { background: #c9a227; color: white; padding: 8px 20px; display: inline-block; margin-top: 10px; border-radius: 4px; }
    .section { margin: 25px 0; padding: 20px; background: #f8f8f8; border-radius: 8px; }
    .section-title { font-size: 16px; font-weight: bold; color: #c9a227; margin-bottom: 15px; text-transform: uppercase; }
    .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .table th { background: #c9a227; color: white; padding: 12px; text-align: left; }
    .table td { padding: 12px; border-bottom: 1px solid #ddd; }
    .table tr:hover { background: #f0f0f0; }
    .total-row { background: #1a1a1a !important; color: white; font-weight: bold; }
    .total-row:hover { background: #1a1a1a !important; }
    .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #888; }
    .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
    .status-pending { background: #fef3c7; color: #d97706; }
    .status-validated { background: #dbeafe; color: #2563eb; }
    .status-delivered { background: #d1fae5; color: #059669; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">AutoÉlite</div>
    <div class="document-title">Bon de Commande</div>
    <div class="order-ref">${this.order.id}</div>
  </div>
`;
  }
  
  buildClientInfo(): void {
    const statusClass = `status-${this.order.state}`;
    const statusLabel = this.order.state === 'pending' ? 'En cours' : 
                       this.order.state === 'validated' ? 'Validée' : 'Livrée';
    
    this.content += `
  <div class="section">
    <div class="section-title">Informations de Commande</div>
    <div style="display: flex; justify-content: space-between; align-items: start;">
      <div>
        <p><strong>Date:</strong> ${formatDate(this.order.createdAt)}</p>
        <p><strong>Pays de livraison:</strong> ${this.order.country}</p>
        <p><strong>Mode de paiement:</strong> ${this.order.paymentMethod === 'cash' ? 'Comptant' : 'Crédit'}</p>
      </div>
      <div>
        <span class="status ${statusClass}">${statusLabel}</span>
      </div>
    </div>
  </div>
`;
  }
  
  buildVehicleDetails(): void {
    this.content += `
  <div class="section">
    <div class="section-title">Détail de la Commande</div>
    <table class="table">
      <thead>
        <tr>
          <th>Article</th>
          <th>Options</th>
          <th>Qté</th>
          <th style="text-align: right;">Prix Unitaire</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
`;
    this.order.items.forEach((item) => {
      const basePrice = item.vehicule.isOnSale && item.vehicule.saleDiscount
        ? item.vehicule.basePrice * (1 - item.vehicule.saleDiscount / 100)
        : item.vehicule.basePrice;
      const optionsPrice = item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
      const totalPrice = (basePrice + optionsPrice) * item.quantity;
      
      this.content += `
        <tr>
          <td>
            <strong>${item.vehicule.brand} ${item.vehicule.name}</strong><br>
            <span style="font-size: 12px; color: #666;">${item.vehicule.model} (${item.vehicule.year})</span>
          </td>
          <td>
            ${item.selectedOptions.length > 0 
              ? item.selectedOptions.map(o => o.name).join(', ') 
              : '<span style="color: #999;">Aucune</span>'}
          </td>
          <td>${item.quantity}</td>
          <td style="text-align: right;">${formatPrice(basePrice + optionsPrice)}</td>
          <td style="text-align: right;">${formatPrice(totalPrice)}</td>
        </tr>
`;
    });
    this.content += `
      </tbody>
    </table>
  </div>
`;
  }
  
  buildPricing(): void {
    const subtotal = this.order.totalAmount - this.order.taxAmount;
    
    this.content += `
  <div class="section">
    <div class="section-title">Récapitulatif</div>
    <table class="table">
      <tbody>
        <tr>
          <td><strong>Sous-total HT</strong></td>
          <td style="text-align: right;">${formatPrice(subtotal)}</td>
        </tr>
        <tr>
          <td><strong>TVA (${this.order.country})</strong></td>
          <td style="text-align: right;">${formatPrice(this.order.taxAmount)}</td>
        </tr>
        <tr class="total-row">
          <td><strong>TOTAL TTC</strong></td>
          <td style="text-align: right; font-size: 18px;">${formatPrice(this.order.totalAmount)}</td>
        </tr>
      </tbody>
    </table>
  </div>
`;
  }
  
  buildFooter(): void {
    this.content += `
  <div class="section" style="background: #1a1a1a; color: white;">
    <p style="margin: 0; text-align: center;">
      Merci pour votre confiance. Pour toute question, contactez-nous.
    </p>
  </div>
  <div class="footer">
    <p>AutoÉlite - Véhicules d'Exception | contact@autoelite.fr</p>
    <p>Document généré le ${formatDate(new Date())}</p>
  </div>
</body>
</html>
`;
  }
  
  getResult(): OrderDocument {
    return {
      type: 'order',
      title: `Bon de Commande - ${this.order.id}`,
      content: this.content,
      format: 'html',
      generatedAt: new Date(),
    };
  }
}

import html2pdf from 'html2pdf.js'; // New import

// Director: Orchestrates the building process
export class DocumentDirector {
  private builder!: DocumentBuilder;
  
  setBuilder(builder: DocumentBuilder): void {
    this.builder = builder;
  }
  
  buildDocument(order: Order): OrderDocument {
    this.builder.setOrder(order);
    this.builder.buildHeader();
    this.builder.buildClientInfo();
    this.builder.buildVehicleDetails();
    this.builder.buildPricing();
    this.builder.buildFooter();
    return this.builder.getResult();
  }
}

// Factory to create all documents for an order
export const generateOrderDocuments = async (order: Order, format: 'html' | 'pdf' = 'html'): Promise<OrderDocument[]> => {
  const director = new DocumentDirector();
  const documents: OrderDocument[] = [];
  
  // Registration request
  director.setBuilder(new HTMLRegistrationBuilder());
  documents.push(director.buildDocument(order));
  
  // Certificate of transfer
  director.setBuilder(new HTMLCertificateBuilder());
  documents.push(director.buildDocument(order));
  
  // Order form
  director.setBuilder(new HTMLOrderBuilder());
  documents.push(director.buildDocument(order));

  if (format === 'pdf') {
    // For PDF, we'll generate the HTML content and then convert it
    // For simplicity, let's just generate the Order Form HTML and convert it to PDF
    const orderFormBuilder = new HTMLOrderBuilder();
    director.setBuilder(orderFormBuilder);
    const orderFormDocument = director.buildDocument(order);

    const pdfOptions = {
      margin: 10,
      filename: `commande_${order.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    await html2pdf().from(orderFormDocument.content).set(pdfOptions).save();
    return []; // Return empty array or handle PDF specific return
  }
  
  return documents;
};
