"use client";

import { useState } from "react";
import { TestimonialForm } from "./TestimonialForm";
import { TestimonialList } from "./TestimonialList";

export function Testimonials() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [listKey, setListKey] = useState(0); // To force list re-render

  const handleAddNew = () => {
    setEditingTestimonial(null);
    setIsFormOpen(true);
  };

  const handleEdit = (testimonial: any) => {
    setEditingTestimonial(testimonial);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingTestimonial(null);
    setListKey(prev => prev + 1); // Force list to re-render with new data
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleAddNew}
          className="flex items-center justify-center rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
        >
          Add New Testimonial
        </button>
      </div>

      {isFormOpen && (
        <TestimonialForm
          testimonial={editingTestimonial}
          onClose={handleClose}
        />
      )}

      <TestimonialList key={listKey} onEdit={handleEdit} />
    </div>
  );
}
