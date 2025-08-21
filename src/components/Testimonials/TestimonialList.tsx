"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Testimonial {
  _id: string;
  name: string;
  title: string;
  message: string;
  image: string;
}

interface TestimonialListProps {
  onEdit: (testimonial: Testimonial) => void;
}

export function TestimonialList({ onEdit }: TestimonialListProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`
      );
      if (!response.ok) throw new Error("Failed to fetch testimonials");
      const data = await response.json();
      setTestimonials(data.testimonials);
      setError(null);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setError("Failed to fetch testimonials. Please try again.")
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete testimonial");

      toast.success("Testimonial deleted successfully");
      await fetchTestimonials(); // Refresh the list
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("Failed to delete testimonial. Please try again.")
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-2 dark:bg-meta-4">
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                Image
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                Name
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                Title
              </th>
              <th className="min-w-[200px] px-4 py-4 font-medium text-dark dark:text-white">
                Message
              </th>
              <th className="px-4 py-4 font-medium text-dark dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((testimonial) => (
              <tr key={testimonial._id}>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  {testimonial.image && (
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={50}
                      height={50}
                      className="rounded-full object-cover"
                    />
                  )}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  {testimonial.name}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  {testimonial.title}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark max-w-md truncate">
                  {testimonial.message}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(testimonial)}
                      className="flex justify-center rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial._id)}
                      className="flex justify-center rounded-lg border border-stroke bg-red-500 px-6 py-[7px] font-medium text-white hover:bg-red-600 dark:border-dark-3"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
