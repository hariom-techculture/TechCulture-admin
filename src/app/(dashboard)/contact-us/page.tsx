"use client";

import { useAuth } from "@/hooks/useAuth";
import { Contact, ContactFilters } from "@/types/contact";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Trash2, Eye, EyeOff, Search, Filter, Calendar } from "lucide-react";

const Switch = ({ checked, onCheckedChange, disabled = false }: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
      } `}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
          checked ? "translate-x-4" : "translate-x-0.5"
        } `}
      />
    </button>
  );
};

const ContactManagement = () => {
  const { token } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ContactFilters>({
    service: "",
    read: "",
  });
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiUrl}/api/contacts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch contacts");
        }

        const data = await response.json();
        // Fix: Handle the API response structure properly
        setContacts(data.contacts || data || []);
      } catch (error: any) {
        const message = error.message || "Error fetching contacts";
        setError(message);
        toast.error(message);
        setContacts([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchContacts();
    }
  }, [apiUrl, token]);

  // Filter contacts based on search and filters
 const filteredContacts = Array.isArray(contacts)
   ? contacts.filter((contact) => {
       const matchesSearch =
         contact?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
         contact?.email?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
         contact?.company?.toLowerCase()?.includes(searchTerm.toLowerCase());

       const matchesService =
         filters.service === "" || contact?.service === filters.service;
       const matchesRead =
         filters.read === "" || contact?.read?.toString() === filters.read;

       return matchesSearch && matchesService && matchesRead;
     })
   : [];

  // Get unique services for filter
 const uniqueServices = Array.from(
   new Set(
     Array.isArray(contacts)
       ? contacts.map((contact) => contact?.service).filter(Boolean)
       : [],
   ),
 );
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleReadToggle = async (
    contactId: string,
    currentReadStatus: boolean,
  ) => {
    const loadingToast = toast.loading("Updating status...");
    try {
      // Update local state immediately for better UX
      setContacts((prev) =>
        Array.isArray(prev)
          ? prev.map((contact) =>
              contact?._id === contactId
                ? { ...contact, read: !currentReadStatus }
                : contact,
            )
          : [],
      );

      // Make the API call
      const response = await fetch(`${apiUrl}/api/contacts/${contactId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ read: !currentReadStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update contact status");
      }

      toast.dismiss(loadingToast);
      toast.success("Status updated successfully");
    } catch (error: any) {
      console.error("Error updating contact:", error);
      toast.dismiss(loadingToast);
      toast.error(error.message || "Failed to update status");

      // Revert the change if API call fails
      setContacts((prev) =>
        Array.isArray(prev)
          ? prev.map((contact) =>
              contact?._id === contactId
                ? { ...contact, read: currentReadStatus }
                : contact,
            )
          : [],
      );
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!window.confirm("Are you sure you want to delete this contact?"))
      return;

    const loadingToast = toast.loading("Deleting contact...");
    try {
      const response = await fetch(`${apiUrl}/api/contacts/${contactId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete contact");
      }

      // Remove from local state only after successful API call
      setContacts((prev) =>
        Array.isArray(prev)
          ? prev.filter((contact) => contact?._id !== contactId)
          : [],
      );

      toast.dismiss(loadingToast);
      toast.success("Contact deleted successfully");
    } catch (error: any) {
      console.error("Error deleting contact:", error);
      toast.dismiss(loadingToast);
      toast.error(error.message || "Failed to delete contact");
    }
  };
  const viewContactDetails = (contact: Contact) => {
    setSelectedContact(contact);
    setShowDetails(true);
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Contact Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and track customer inquiries and communication
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Service Filter */}
          <select
            value={filters.service}
            onChange={(e) => setFilters(prev => ({ ...prev, service: e.target.value }))}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Services</option>
            {uniqueServices.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>

          {/* Read Status Filter */}
          <select
            value={filters.read}
            onChange={(e) => setFilters(prev => ({ ...prev, read: e.target.value }))}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="true">Read</option>
            <option value="false">Unread</option>
          </select>
        </div>
      </div>

      {/* Contact Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Contacts
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {contacts.length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Unread
              </p>
              <p className="text-2xl font-bold text-red-600">
                {contacts.filter((c) => !c.read).length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Read
              </p>
              <p className="text-2xl font-bold text-green-600">
                {contacts.filter((c) => c.read).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Contact
                </th>
                <th className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 sm:table-cell">
                  Company & Service
                </th>
                <th className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 lg:table-cell">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {filteredContacts.map((contact) => (
                <tr
                  key={contact._id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${!contact.read ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                          {contact.name}
                          {!contact.read && (
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              New
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {contact.email}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 sm:hidden">
                          {contact.company} • {contact.service}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden whitespace-nowrap px-6 py-4 sm:table-cell">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {contact.company}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {contact.service}
                    </div>
                  </td>
                  <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400 lg:table-cell">
                    {formatDate(contact.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={contact.read}
                        onCheckedChange={() =>
                          handleReadToggle(contact._id, contact.read)
                        }
                        disabled={loading}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {contact.read ? "Read" : "Unread"}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => viewContactDetails(contact)}
                        className="rounded p-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact._id)}
                        className="rounded p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete Contact"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredContacts.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No contacts found matching your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Contact Details Modal */}
      {showDetails && selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white dark:bg-gray-800">
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Contact Details
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedContact.name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedContact.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {/* Phone is not in our Contact interface, removing this field */}
                    N/A
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Company
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedContact.company}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Service
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedContact.service}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Message
                  </label>
                  <p className="whitespace-pre-wrap text-gray-900 dark:text-white">
                    {selectedContact.message}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(selectedContact.createdAt)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <Switch
                      checked={selectedContact.read}
                      onCheckedChange={() => {
                        handleReadToggle(
                          selectedContact._id,
                          selectedContact.read,
                        );
                        setSelectedContact((prev) => {
                          if (!prev) return null;
                          return {
                            ...prev,
                            read: !prev.read
                          };
                        });
                      }}
                      disabled={loading}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedContact.read ? "Read" : "Unread"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setShowDetails(false)}
                  className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDeleteContact(selectedContact._id);
                    setShowDetails(false);
                  }}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Delete Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactManagement;
