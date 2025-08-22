"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { Project } from '@/types/project';
import Image from 'next/image';
import { TextAreaGroup } from '@/components/FormElements/InputGroup/text-area';
import InputGroup from '@/components/FormElements/InputGroup';

export default function ProjectsPage() {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    technologies: [] as string[],
    status: 'ongoing' as 'ongoing' | 'completed',
    file: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [techInput, setTechInput] = useState('');

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data.projects);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const promise = new Promise(async (resolve, reject) => {
      try {
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('location', formData.location);
        data.append('status', formData.status);
        data.append('technologies', JSON.stringify(formData.technologies));
        if (formData.file) {
          data.append('file', formData.file);
        }

        const url = editingProject
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${editingProject._id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/projects`;

        const response = await fetch(url, {
          method: editingProject ? 'PUT' : 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        });

        if (!response.ok) throw new Error('Failed to save project');
        await fetchProjects();
        resetForm();
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: editingProject ? 'Updating project...' : 'Creating project...',
      success: editingProject ? 'Project updated!' : 'Project created!',
      error: 'Failed to save project',
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    const promise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error('Failed to delete project');
        await fetchProjects();
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: 'Deleting project...',
      success: 'Project deleted!',
      error: 'Failed to delete project',
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      location: '',
      technologies: [],
      status: 'ongoing',
      file: null,
    });
    setPreviewUrl(null);
    setEditingProject(null);
    setIsFormOpen(false);
    setTechInput('');
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      location: project.location || '',
      technologies: project.technologies,
      status: project.status,
      file: null,
    });
    setPreviewUrl(project.image);
    setIsFormOpen(true);
  };

  const addTechnology = () => {
    if (techInput.trim()) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()],
      }));
      setTechInput('');
    }
  };

  return (
    <>
      <Breadcrumb pageName="Projects" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-4 md:p-6 xl:p-9">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-black dark:text-white">
              Projects
            </h2>
            <button
              onClick={() => setIsFormOpen(true)}
              className="rounded-lg bg-primary px-6 py-2 text-white hover:bg-opacity-90"
            >
              Add New Project
            </button>
          </div>

          {isFormOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center pt-30">
              <div className="bg-white dark:bg-boxdark rounded-lg p-6 max-w-2xl w-full max-h-[0vh] overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <InputGroup
                    label="Title"
                    type="text"
                    placeholder="Enter project title"
                    required
                    value={formData.title}
                    handleChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />

                  <TextAreaGroup
                    label="Description"
                    placeholder="Enter project description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />

                  <InputGroup
                    label="Category"
                    type="text"
                    placeholder="Enter project category"
                    required
                    value={formData.category}
                    handleChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  />

                  <InputGroup
                    label="Location"
                    type="text"
                    placeholder="Enter project location"
                    value={formData.location}
                    handleChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />

                  <div className="space-y-2">
                    <label className="mb-3 block text-black dark:text-white">
                      Technologies
                    </label>
                    <div className="flex gap-2">
                      <InputGroup
                      label=''
                        type="text"
                        placeholder="Add technology"
                        value={techInput}
                        handleChange={(e) => setTechInput(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={addTechnology}
                        className="px-4 py-2 bg-primary text-white rounded-lg"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center gap-2"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              technologies: prev.technologies.filter((_, i) => i !== index),
                            }))}
                            className="text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="mb-3 block text-black dark:text-white">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        status: e.target.value as 'ongoing' | 'completed',
                      }))}
                      className="w-full rounded-lg border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-strokedark"
                    >
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <InputGroup
                  placeholder=''
                    label="Project Image"
                    type="file"
                    accept="image/*"
                    required={!editingProject}
                    handleChange={handleFileChange}
                  />

                  {previewUrl && (
                    <div className="mt-4 relative aspect-video">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-primary px-6 py-2 text-white hover:bg-opacity-90"
                    >
                      {editingProject ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="group relative rounded-lg overflow-hidden border border-stroke dark:border-strokedark"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        project.status === 'completed'
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      }`}>
                        {project.status}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(project)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-full text-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}