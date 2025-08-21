"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { JobPost, JOB_TYPES } from '@/types/job';
import InputGroup from '@/components/FormElements/InputGroup';
import { TextAreaGroup } from '@/components/FormElements/InputGroup/text-area';


export default function JobPostPage() {
  const { token } = useAuth();
  console.log("token in the post form ", token)
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPost | null>(null);
  const [filters, setFilters] = useState({
    department: '',
    location: '',
    type: '',
    isActive: 'all',
  });
  const [skillInput, setSkillInput] = useState('');
  const [formData, setFormData] = useState({
    jobId: '',
    title: '',
    description: '',
    department: '',
    location: '',
    type: 'Full-time' as const,
    salaryRange: {
      min: 0,
      max: 0,
    },
    experienceRequired: '',
    skills: [] as string[],
    isActive: true,
    deadline: '',
  });

  const fetchJobPosts = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.department) queryParams.append('department', filters.department);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.isActive !== 'all') queryParams.append('isActive', String(filters.isActive === 'active'));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/job-posts/filter?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch job posts');
      const data = await response.json();
      setJobPosts(data);
    } catch (error) {
      toast.error('Failed to load job posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobPosts();
  }, [filters]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.jobId || !formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const promise = new Promise(async (resolve, reject) => {
      try {
        const url = editingJob
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/job-posts/${editingJob.jobId}`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/job-posts`;

        const response = await fetch(url, {
          method: editingJob ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Failed to save job post');
        await fetchJobPosts();
        resetForm();
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: editingJob ? 'Updating job post...' : 'Creating job post...',
      success: editingJob ? 'Job post updated!' : 'Job post created!',
      error: 'Failed to save job post',
    });
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job post?')) return;

    const promise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/job-posts/${jobId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error('Failed to delete job post');
        await fetchJobPosts();
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: 'Deleting job post...',
      success: 'Job post deleted!',
      error: 'Failed to delete job post',
    });
  };

  const resetForm = () => {
    setFormData({
      jobId: '',
      title: '',
      description: '',
      department: '',
      location: '',
      type: 'Full-time',
      salaryRange: {
        min: 0,
        max: 0,
      },
      experienceRequired: '',
      skills: [],
      isActive: true,
      deadline: '',
    });
    setEditingJob(null);
    setIsFormOpen(false);
    setSkillInput('');
  };

  const handleEdit = (job: JobPost) => {
    setEditingJob(job);
    setFormData({
      jobId: job.jobId,
      title: job.title,
      description: job.description,
      department: job.department || '',
      location: job.location || '',
      type: job.type,
      salaryRange: job.salaryRange || { min: 0, max: 0 },
      experienceRequired: job.experienceRequired || '',
      skills: job.skills,
      isActive: job.isActive,
      deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
    });
    setIsFormOpen(true);
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  return (
    <>
      <Breadcrumb pageName="Job Posts" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-4 md:p-6 xl:p-9">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-black dark:text-white">
              Job Posts Management
            </h2>
            <button
              onClick={() => setIsFormOpen(true)}
              className="rounded-lg bg-primary px-6 py-2 text-white hover:bg-opacity-90"
            >
              Post New Job
            </button>
          </div>

          {/* Filters Section */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <InputGroup
              type="text"
              placeholder="Filter by department"
              value={filters.department}
              handleChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
            />
            <InputGroup
              type="text"
              placeholder="Filter by location"
              value={filters.location}
              handleChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            />
            <select
              className="rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="">All Types</option>
              {JOB_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              className="rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark"
              value={filters.isActive}
              onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value }))}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Job Posts List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobPosts.map((job) => (
                <div
                  key={job._id}
                  className="rounded-lg border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                      {job.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        job.isActive
                          ? 'bg-success/10 text-success'
                          : 'bg-danger/10 text-danger'
                      }`}
                    >
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {job.department} • {job.location}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {job.type} • {job.experienceRequired}
                    </p>
                    {job.salaryRange && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ₹{job.salaryRange.min.toLocaleString()} - ₹{job.salaryRange.max.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {job.description}
                    </p>
                  </div>
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-stroke dark:border-strokedark">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Posted: {(job.createdAt)}
                      {job.deadline && (
                        <div>Deadline: {(job.deadline)}</div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(job)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job.jobId)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-full text-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Job Post Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-boxdark rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">
              {editingJob ? 'Edit Job Post' : 'Create New Job Post'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputGroup
                label="Job ID"
                type="text"
                placeholder="Enter unique job ID"
                required
                disabled={!!editingJob}
                value={formData.jobId}
                handleChange={(e) => setFormData(prev => ({ ...prev, jobId: e.target.value }))}
              />

              <InputGroup
                label="Title"
                type="text"
                placeholder="Enter job title"
                required
                value={formData.title}
                handleChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />

              <TextAreaGroup
                label="Description"
                placeholder="Enter job description"
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup
                  label="Department"
                  type="text"
                  placeholder="Enter department"
                  value={formData.department}
                  handleChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                />

                <InputGroup
                  label="Location"
                  type="text"
                  placeholder="Enter location"
                  value={formData.location}
                  handleChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Job Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      type: e.target.value as typeof JOB_TYPES[number],
                    }))}
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark"
                  >
                    {JOB_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <InputGroup
                  label="Experience Required"
                  type="text"
                  placeholder="e.g., 2+ years"
                  value={formData.experienceRequired}
                  handleChange={(e) => setFormData(prev => ({ ...prev, experienceRequired: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup
                  label="Minimum Salary"
                  type="number"
                  placeholder="Enter minimum salary"
                  value={formData.salaryRange.min.toString()}
                  handleChange={(e) => setFormData(prev => ({
                    ...prev,
                    salaryRange: { ...prev.salaryRange, min: Number(e.target.value) },
                  }))}
                />

                <InputGroup
                  label="Maximum Salary"
                  type="number"
                  placeholder="Enter maximum salary"
                  value={formData.salaryRange.max.toString()}
                  handleChange={(e) => setFormData(prev => ({
                    ...prev,
                    salaryRange: { ...prev.salaryRange, max: Number(e.target.value) },
                  }))}
                />
              </div>

              <InputGroup
                label="Application Deadline"
                type="date"
                value={formData.deadline}
                handleChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              />

              <div className="space-y-2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Skills Required
                </label>
                <div className="flex gap-2">
                  <InputGroup
                    type="text"
                    placeholder="Add skill"
                    value={skillInput}
                    handleChange={(e) => setSkillInput(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-primary text-white rounded-lg"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center gap-2"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          skills: prev.skills.filter((_, i) => i !== index),
                        }))}
                        className="text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="form-checkbox"
                />
                <label htmlFor="isActive" className="text-sm text-gray-600 dark:text-gray-400">
                  Job Post is Active
                </label>
              </div>

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
                  {editingJob ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}