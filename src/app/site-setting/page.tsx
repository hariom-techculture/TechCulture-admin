// "use client";
// import React from "react";
// import InputGroup from "@/components/FormElements/InputGroup";
// import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
// import { Select } from "@/components/FormElements/select";
// import { ShowcaseSection } from "@/components/Layouts/showcase-section";
// import { X } from "lucide-react";

// export default function ContactForm() {
//   const [selectedLogo, setSelectedLogo] = React.useState<File | null>(null);
//   const [clientLogos, setClientLogos] = React.useState<File[]>([]);
//   const [error, setError] = React.useState<string>('');

//   const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Validate file size (2MB max)
//     if (file.size > 2 * 1024 * 1024) {
//       setError('Logo file size must be less than 2MB');
//       return;
//     }

//     // Validate file type
//     const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
//     if (!validTypes.includes(file.type)) {
//       setError('Please upload a valid image file (PNG, JPG, or SVG)');
//       return;
//     }

//     setSelectedLogo(file);
//     setError('');
//   };

//   const handleDeleteLogo = (e: React.MouseEvent) => {
//     e.preventDefault();
//     setSelectedLogo(null);
//   };

//   const handleClientLogoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
    
//     // Check if adding new logos would exceed the limit
//     if (clientLogos.length + files.length > 10) {
//       setError('Maximum 10 client logos allowed');
//       return;
//     }

//     // Validate each file
//     const validFiles = files.filter(file => {
//       if (file.size > 2 * 1024 * 1024) {
//         setError('Each logo file size must be less than 2MB');
//         return false;
//       }
//       const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
//       if (!validTypes.includes(file.type)) {
//         setError('Please upload valid image files (PNG, JPG, or SVG)');
//         return false;
//       }
//       return true;
//     });

//     setClientLogos(prev => [...prev, ...validFiles]);
//     setError('');
//   };

//   const handleDeleteClientLogo = (index: number) => {
//     setClientLogos(prev => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <ShowcaseSection title="Site Settings " className="!p-6.5">
//       <form action="#">
//         <InputGroup
//           label="Title"
//           type="text"
//           placeholder="Enter Website Title"
//           className="mb-4.5"
//         />
//         <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
//           <InputGroup
//             label="Contact No."
//             type="text"
//             placeholder="Enter Contact Number"
//             className="w-full xl:w-1/2"
//           />

//           <InputGroup
//             label="Email"
//             type="email"
//             placeholder="Enter email address"
//             className="xl:w-1/2"
//             required
//           />
//         </div>

//         <InputGroup
//           label="Address"
//           type="text"
//           placeholder="Enter Address"
//           className="mb-4.5"
//         />

//         {/* Logo Upload Section */}
//         <h3 className="mb-4 font-medium text-black dark:text-white">
//           Company Logo
//         </h3>
//         <div className="dark:border-strokedark dark:bg-boxdark mb-6 rounded-xl border border-stroke bg-white p-4">
//           <div className="flex items-center gap-4">
//             <div className="relative max-h-45 max-w-45">
//               <div className="dark:border-strokedark dark:bg-meta-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-stroke bg-gray">
//                 {selectedLogo ? (
//                   <div className="max-h-45 max-w-45">
//                     <img
//                       src={URL.createObjectURL(selectedLogo)}
//                       alt="Selected Logo"
//                       className="h-24 w-full rounded-lg object-contain"
//                     />
//                     <button
//                       onClick={handleDeleteLogo}
//                       className="bg-danger hover:bg-danger-dark absolute -right-4 -top-4 flex h-7 w-7 items-center justify-center rounded-full bg-red-400 p-1"
//                     >
//                       <X className="text-white" />
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="flex flex-col items-center justify-center p-4">
//                     <span className="text-primary">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-10 w-10"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                         />
//                       </svg>
//                     </span>
//                     <p className="mt-2 text-sm text-black dark:text-white">
//                       Drop your logo here or click to upload
//                     </p>
//                   </div>
//                 )}
//                 <input
//                   type="file"
//                   accept="image/*"
//                   handleChange={handleLogoChange}
//                   className="absolute inset-0 cursor-pointer opacity-0"
//                 />
//               </div>
//             </div>
//             <div className="flex-1">
//               <p className="mb-2 text-sm text-black dark:text-white">
//                 Accepted file types: PNG, JPG, SVG
//               </p>
//               <p className="text-body text-xs">Maximum file size: 2MB</p>
//             </div>
//           </div>
//         </div>

//         {/* Client Logos Upload Section */}
//         <h3 className="mb-4 font-medium text-black dark:text-white">
//           Client Logos
//         </h3>
//         <div className="dark:border-strokedark dark:bg-boxdark mb-6 rounded-xl border border-stroke bg-white p-4">
//           <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
//             {clientLogos.map((logo, index) => (
//               <div key={index} className="group relative">
//                 <img
//                   src={URL.createObjectURL(logo)}
//                   alt={`Client Logo ${index + 1}`}
//                   className="dark:border-strokedark h-24 w-full rounded-lg border border-stroke object-contain p-2"
//                 />
//                 <button
//                   onClick={() => handleDeleteClientLogo(index)}
//                   className="bg-danger hover:bg-danger-dark absolute -right-4 -top-4 flex h-7 w-7 items-center justify-center rounded-full bg-red-400 p-1 text-white"
//                 >
//                   <X />
//                 </button>
//               </div>
//             ))}
//             <div className="dark:border-strokedark dark:hover:bg-meta-4 relative flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-stroke transition-colors hover:bg-gray-50">
//               <span className="text-primary">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-8 w-8"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                   />
//                 </svg>
//               </span>
//               <p className="text-body mt-2 text-xs">Add Client Logo</p>
//               <input
//                 type="file"
//                 accept="image/*"
//                 handleChange={handleClientLogoAdd}
//                 className="absolute inset-0 cursor-pointer opacity-0"
//                 multiple
//               />
//             </div>
//           </div>
//           <p className="text-body text-xs">
//             You can upload multiple client logos. Maximum 10 logos allowed.
//           </p>
//         </div>

//         <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
//           <InputGroup
//             label="Facebook Link"
//             type="text"
//             placeholder="Enter Contact Number"
//             className="w-full xl:w-1/2"
//           />

//           <InputGroup
//             label="Instagram Link"
//             type="text"
//             placeholder="Enter email address"
//             className="xl:w-1/2"
//           />
//         </div>
//         <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
//           <InputGroup
//             label="Twitter Link"
//             type="text"
//             placeholder="Enter Contact Number"
//             className="w-full xl:w-1/2"
//           />

//           <InputGroup
//             label="Linkedin Link"
//             type="text"
//             placeholder="Enter email address"
//             className="xl:w-1/2"
//           />
//         </div>

//         <TextAreaGroup
//           label="Address Iframe"
//           placeholder="Enter Address Iframe"
//         />

//         <button className="mt-6 flex justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90">
//           Send Message
//         </button>
//       </form>
//     </ShowcaseSection>
//   );
// }






"use client";
import React, { useEffect } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { X } from "lucide-react";

export default function ContactForm() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [formData, setFormData] = React.useState<any>({
    siteTitle: "",
    email: "",
    contactNo: "",
    address: "",
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    iframe: "",
  });
  const [selectedLogo, setSelectedLogo] = React.useState<File | null>(null);
  const [clientLogos, setClientLogos] = React.useState<File[]>([]);
  const [existingLogo, setExistingLogo] = React.useState<string | null>(null);
  const [existingClients, setExistingClients] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string>("");

  // ✅ Fetch existing settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/site-settings`);
        const json = await res.json();
        if (json.success && json.data) {
          setFormData({
            siteTitle: json.data.siteTitle || "",
            email: json.data.email || "",
            contactNo: json.data.contactNo || "",
            address: json.data.address || "",
            facebook: json.data.facebook || "",
            instagram: json.data.instagram || "",
            twitter: json.data.twitter || "",
            linkedin: json.data.linkedin || "",
            iframe: json.data.iframe || "",
          });
          setExistingLogo(json.data.logo || null);
          setExistingClients(json.data.clients || []);
        }
      } catch (err) {
        console.error("Failed to fetch site settings", err);
      }
    };
    fetchSettings();
  }, []);

  // ✅ Handle text input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle logo change
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Logo file size must be less than 2MB");
      return;
    }
    const validTypes = ["image/jpeg", "image/png", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image file (PNG, JPG, or SVG)");
      return;
    }
    setSelectedLogo(file);
    setExistingLogo(null); // remove old preview
    setError("");
  };

  // ✅ Handle client logo add
  const handleClientLogoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (clientLogos.length + files.length + existingClients.length > 10) {
      setError("Maximum 10 client logos allowed");
      return;
    }
    setClientLogos((prev) => [...prev, ...files]);
    setError("");
  };

  const handleDeleteExistingClient = (index: number) => {
    setExistingClients((prev) => prev.filter((_, i) => i !== index));
  };
  const handleDeleteNewClient = (index: number) => {
    setClientLogos((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) fd.append(key, formData[key]);
    });

    if (selectedLogo) {
      fd.append("logo", selectedLogo);
    }
    clientLogos.forEach((file) => fd.append("clients", file));

    try {
      const res = await fetch(`${apiUrl}/api/site-settings`, {
        method: "PUT",
        body: fd,
      });
      const json = await res.json();
      if (json.success) {
        alert("Settings updated successfully!");
        setExistingLogo(json.data.logo);
        setExistingClients(json.data.clients || []);
        setClientLogos([]);
        setSelectedLogo(null);
      } else {
        setError(json.message || "Failed to update");
      }
    } catch (err) {
      console.error("Error saving settings", err);
      setError("Server error while saving");
    }
  };

  return (
    <ShowcaseSection title="Site Settings" className="!p-6.5">
      <form onSubmit={handleSubmit}>
        {/* Title, Contact, Email */}
        <InputGroup
          label="Title"
          name="siteTitle"
          type="text"
          value={formData.siteTitle}
          handleChange={handleChange}
          className="mb-4.5"
          placeholder="Enter the Title"
        />
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Contact No."
            name="contactNo"
            type="text"
            value={formData.contactNo}
            handleChange={handleChange}
            className="w-full xl:w-1/2"
            placeholder="Enter Contact Number"
          />
          <InputGroup
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            handleChange={handleChange}
            className="xl:w-1/2"
            required
            placeholder="Enter email address"
          />
        </div>

        <InputGroup
          label="Address"
          name="address"
          type="text"
          value={formData.address}
          handleChange={handleChange}
          className="mb-4.5"
          placeholder="Enter Address"
        />

        {/* Logo Upload */}
        <h3 className="mb-4 font-medium text-black dark:text-white">
          Company Logo
        </h3>
        <div className="mb-6 rounded-xl border p-4">
          {existingLogo && !selectedLogo ? (
            <img
              src={existingLogo}
              alt="Company Logo"
              className="h-24 object-contain"
            />
          ) : selectedLogo ? (
            <img
              src={URL.createObjectURL(selectedLogo)}
              alt="New Logo"
              className="h-24 object-contain"
            />
          ) : (
            <p>No logo uploaded</p>
          )}
          <input type="file" accept="image/*" onChange={handleLogoChange} />
        </div>

        {/* Client Logos */}
        <h3 className="mb-4 font-medium text-black dark:text-white">
          Client Logos
        </h3>
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {existingClients.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                className="h-24 rounded-lg border object-contain p-2"
              />
              <button
                type="button"
                onClick={() => handleDeleteExistingClient(index)}
                className="absolute right-0 top-0 rounded-full bg-red-500 p-1 text-white"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          {clientLogos.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                className="h-24 rounded-lg border object-contain p-2"
              />
              <button
                type="button"
                onClick={() => handleDeleteNewClient(index)}
                className="absolute right-0 top-0 rounded-full bg-red-500 p-1 text-white"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleClientLogoAdd}
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Facebook Link"
            name="facebook"
            type="text"
            value={formData.facebook}
            handleChange={handleChange}
            className="w-full xl:w-1/2"
            placeholder="Enter Facebook Link"
          />
          <InputGroup
            label="Instagram Link"
            name="instagram"
            type="text"
            value={formData.instagram}
            handleChange={handleChange}
            className="xl:w-1/2"
            placeholder="Enter Instagram Link"
          />
        </div>
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Twitter Link"
            name="twitter"
            type="text"
            value={formData.twitter}
            handleChange={handleChange}
            className="w-full xl:w-1/2"
            placeholder="Enter Twitter Link"
          />
          <InputGroup
            label="Linkedin Link"
            name="linkedin"
            type="text"
            value={formData.linkedin}
            handleChange={handleChange}
            className="xl:w-1/2"
            placeholder="Enter Linkedin Link"
          />
        </div>

        <TextAreaGroup
          label="Address Iframe"
          name="iframe"
          value={formData.iframe}
          onChange={handleChange}
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="mt-6 flex justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90"
        >
          Save Settings
        </button>
      </form>
    </ShowcaseSection>
  );
}
