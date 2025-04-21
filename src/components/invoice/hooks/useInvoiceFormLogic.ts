import { useState } from "react";
import { Invoice, InvoiceItem } from "@/pages/Invoicing";
import { UseFormReturn } from "react-hook-form";
import { NavigateFunction } from "react-router-dom";

export function useInvoiceFormLogic(
  form: UseFormReturn<any>,
  invoice: Invoice | null | undefined,
  navigate: NavigateFunction,
  toast: any
) {
  const [items, setItems] = useState<InvoiceItem[]>(
    invoice?.items || [{
      description: "",
      startTime: "",
      endTime: "",
      quantity: 1,
      rate: 0,
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      address: ""
    }]
  );

  const [transactionFee, setTransactionFee] = useState(invoice?.transactionFee || 3.5);
  const [amountPaid, setAmountPaid] = useState(invoice?.amountPaid || 0);

  const handleAddItem = () => {
    const lastItem = items[items.length - 1];
    setItems([...items, { 
      description: "", 
      startTime: "", 
      endTime: "", 
      quantity: 1, 
      rate: 0, 
      amount: 0,
      date: lastItem?.date || new Date().toISOString().split('T')[0],
      address: lastItem?.address || ""
    }]);
  };

  const handleAddDate = (newDate: string, address: string) => {
    console.log('Adding new date group:', newDate, 'with address:', address);
    if (items.some(item => item.date === newDate)) {
      toast({
        title: "Date already exists",
        description: "This date already has a group of items.",
        variant: "destructive",
      });
      return;
    }

    setItems([...items, {
      description: "",
      startTime: "",
      endTime: "",
      quantity: 1,
      rate: 0,
      amount: 0,
      date: newDate,
      address: address
    }]);
  };

  const handleDeleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const newItems = [...items];
    const currentItem = { ...newItems[index] };
    
    if (field === "description" || field === "startTime" || field === "endTime" || field === "date" || field === "address") {
      currentItem[field] = value as string;
    } else {
      currentItem[field] = Number(value);
    }
    
    if (currentItem.startTime && currentItem.endTime) {
      const start = new Date(`1970-01-01T${currentItem.startTime}`);
      const end = new Date(`1970-01-01T${currentItem.endTime}`);
      
      if (end < start) {
        end.setDate(end.getDate() + 1);
      }
      
      const diffMs = end.getTime() - start.getTime();
      const hours = diffMs / (1000 * 60 * 60);
      currentItem.hours = Number(hours.toFixed(2));
    } else {
      currentItem.hours = 0;
    }
    
    currentItem.amount = Number((currentItem.hours || 0) * currentItem.quantity * currentItem.rate);
    
    newItems[index] = currentItem;
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + Number(item.amount), 0);
  const transactionFeeAmount = (subtotal * transactionFee) / 100;
  const total = subtotal + transactionFeeAmount;
  const balanceDue = total - amountPaid;

  const handleSubmit = form.handleSubmit((values) => {
    console.log('Form submitted with values:', values);
    
    if (!values.clientName) {
      toast({
        title: "Error",
        description: "Client name is required",
        variant: "destructive",
      });
      return;
    }

    if (items.some(item => !item.description || item.amount === 0)) {
      toast({
        title: "Error",
        description: "All items must have a description and valid amount",
        variant: "destructive",
      });
      return;
    }

    const newInvoice: Partial<Invoice> = {
      ...values,
      items: items.map(item => ({
        ...item,
        hours: Number(item.hours) || 0,
        quantity: Number(item.quantity) || 0,
        rate: Number(item.rate) || 0,
        amount: Number((item.hours || 0) * item.quantity * item.rate)
      })),
      amount: total,
      amountPaid,
      balanceDue,
      status: amountPaid === 0 ? 'unpaid' : amountPaid === total ? 'paid' : 'partially_paid',
      transactionFee,
    };

    console.log('Viewing invoice:', newInvoice);
    navigate('/invoicing/view', { state: { invoice: newInvoice } });
  });

  return {
    items,
    transactionFee,
    amountPaid,
    subtotal,
    transactionFeeAmount,
    total,
    balanceDue,
    handleAddItem,
    handleAddDate,
    handleDeleteItem,
    handleItemChange,
    setTransactionFee,
    setAmountPaid,
    handleSubmit
  };
}