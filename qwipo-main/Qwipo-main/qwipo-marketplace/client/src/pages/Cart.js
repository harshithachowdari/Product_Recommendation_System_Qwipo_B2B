import React from 'react';
import styled from 'styled-components';
import { useCart } from '../contexts/CartContext';
import { Trash2 } from 'lucide-react';

const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
`;

const Item = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr auto auto auto;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
  &:last-child { border-bottom: none; }
`;

const Thumb = styled.img`
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 8px;
  background: #f8fafc;
`;

const Name = styled.div`
  font-weight: 600;
  color: #111827;
`;

const Price = styled.div`
  color: #111827;
  font-weight: 600;
`;

const Qty = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QtyBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  cursor: pointer;
`;

const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
`;

const CheckoutBtn = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1.25rem;
  font-weight: 600;
  cursor: pointer;
`;

export default function Cart() {
  const { items, removeItem, addItem, totalAmount, totalCount } = useCart();

  return (
    <Container>
      <Title>Cart</Title>
      <Card>
        {items.length === 0 ? (
          <div style={{ color: '#6b7280' }}>Your cart is empty.</div>
        ) : (
          <>
            {items.map(({ product, qty }) => (
              <Item key={product._id}>
                <Thumb src={product.images?.[0]} alt={product.name} />
                <Name>{product.name}</Name>
                <Price>₹{(product.pricing?.sellingPrice || 0).toLocaleString()}</Price>
                <Qty>
                  <QtyBtn onClick={() => addItem(product, -1)} disabled={qty <= 1}>-</QtyBtn>
                  <div>{qty}</div>
                  <QtyBtn onClick={() => addItem(product, 1)}>+</QtyBtn>
                </Qty>
                <RemoveBtn onClick={() => removeItem(product._id)} title="Remove">
                  <Trash2 size={18} />
                </RemoveBtn>
              </Item>
            ))}
            <Footer>
              <div style={{ color: '#6b7280' }}>{totalCount} item(s)</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>Total: ₹{totalAmount.toLocaleString()}</div>
              <CheckoutBtn>Proceed to Checkout</CheckoutBtn>
            </Footer>
          </>
        )}
      </Card>
    </Container>
  );
}
