import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import Button from '../../common/Button/Button';
import { submitInquiry } from '../../../api/inquiries';
import styles from './ContactForm.module.css';

const PROJECT_TYPE_OPTIONS = [
  { value: 'PRESENTATION_DESIGN', label: 'Presentation Design' },
  { value: 'BUSINESS_DOCUMENTS', label: 'Business Documents' },
  { value: 'SALES_ENABLEMENT', label: 'Marketing Collateral' },
  { value: 'RESEARCH', label: 'Research & Data' },
  { value: 'DEDICATED_DESIGNER', label: 'Ongoing Design Support' },
  { value: 'OTHER', label: 'Something Else' }
];

const TIMELINE_OPTIONS = [
  { value: '', label: 'Select timeline' },
  { value: 'Urgent (Within 24–48 hours)', label: 'Urgent (Within 24–48 hours)' },
  { value: 'Within 1 week', label: 'Within 1 week' },
  { value: '1 – 2 weeks', label: '1 – 2 weeks' },
  { value: '2 – 4 weeks', label: '2 – 4 weeks' },
  { value: 'Flexible / Strategic planning', label: 'Flexible / Strategic planning' }
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.png', '.jpg', '.jpeg', '.webp'];

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ContactForm({ selectedProjectType = 'PRESENTATION_DESIGN', onSelectProjectType }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    description: '',
    slidesCount: '',
    timeline: '',
  });

  const [briefFile, setBriefFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);

  const handleProjectTypeChange = (e) => {
    const val = e.target.value;
    if (onSelectProjectType) {
      onSelectProjectType(val);
    }
    if (errors.projectType) {
      setErrors((prev) => ({ ...prev, projectType: null }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'projectType' && onSelectProjectType) {
      onSelectProjectType(value);
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (errors.form) {
      setErrors((prev) => ({ ...prev, form: null }));
    }
  };

  const handleFileSelection = (file) => {
    if (!file) return;

    const fileName = file.name || '';
    const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setErrors((prev) => ({
        ...prev,
        brief: `Invalid format (${ext}). Supported: PDF, PPT, DOC, PNG, JPG.`
      }));
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrors((prev) => ({
        ...prev,
        brief: `File exceeds 10MB limit (${formatFileSize(file.size)}).`
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, brief: null }));
    setBriefFile(file);
  };

  const onFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setBriefFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters long.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Work Email is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please provide a valid work email address.';
      }
    }

    if (!selectedProjectType) {
      newErrors.projectType = 'Please select what you need.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please tell us about your project.';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Project description must be at least 10 characters long.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstField = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstField);
      if (element) {
        element.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = new FormData();
      payload.append('fullName', formData.fullName.trim());
      if (formData.companyName.trim()) {
        payload.append('companyName', formData.companyName.trim());
      }
      payload.append('email', formData.email.trim());
      payload.append('projectType', selectedProjectType || 'PRESENTATION_DESIGN');
      
      if (formData.timeline) {
        payload.append('timeline', formData.timeline);
      }

      let formattedDescription = formData.description.trim();
      if (formData.slidesCount.trim()) {
        formattedDescription = `[Approx. Slides/Pages: ${formData.slidesCount.trim()}]\n\n${formattedDescription}`;
      }
      payload.append('description', formattedDescription);

      if (briefFile) {
        payload.append('brief', briefFile);
        payload.append('attachedFile', briefFile);
      }

      await submitInquiry(payload);
      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err) {
      setIsSubmitting(false);

      const fieldErrors = {};
      if (Array.isArray(err.errors)) {
        err.errors.forEach((e) => {
          const field = e.field || (Array.isArray(e.path) ? e.path[0] : null);
          if (field) {
            fieldErrors[field] = e.message;
          }
        });
      }

      setErrors({
        ...fieldErrors,
        form: err.message || 'Unable to submit your inquiry at this moment. Please email hello@slidevance.com directly.',
      });
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      companyName: '',
      projectType: 'PRESENTATION_DESIGN',
      description: '',
      slidesCount: '',
      timeline: '',
    });
    setBriefFile(null);
    setErrors({});
    setIsSubmitted(false);
    if (onSelectProjectType) {
      onSelectProjectType('PRESENTATION_DESIGN');
    }
  };

  if (isSubmitted) {
    return (
      <div className={styles.formCard} role="status" aria-live="polite">
        <div className={styles.successCard}>
          <div className={styles.successIconCircle}>
            <CheckCircle2 size={36} className={styles.successCheckIcon} />
          </div>
          <h3 className={styles.successHeading}>
            Thank you! Your project inquiry is submitted.
          </h3>
          <p className={styles.successMessage}>
            We’ll review your details and get back to you within 1 business day.
          </p>

          <div className={styles.submissionDetails}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Client Name:</span>
              <span className={styles.detailValue}>{formData.fullName}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Work Email:</span>
              <span className={styles.detailValue}>{formData.email}</span>
            </div>
            {formData.companyName && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Company:</span>
                <span className={styles.detailValue}>{formData.companyName}</span>
              </div>
            )}
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Project Category:</span>
              <span className={styles.detailValue}>
                {PROJECT_TYPE_OPTIONS.find((opt) => opt.value === formData.projectType)?.label || formData.projectType}
              </span>
            </div>
            {briefFile && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Attached Brief:</span>
                <span className={styles.detailValue}>{briefFile.name} ({formatFileSize(briefFile.size)})</span>
              </div>
            )}
          </div>

          <div className={styles.successActions}>
            <Button variant="primary" onClick={handleReset}>
              Submit Another Inquiry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formCard} id="inquiry-form-card">
      {/* Step indicator header */}
      <div className={styles.stepHeader}>
        <span className={styles.stepText}>STEP 1 OF 1</span>
        <div className={styles.stepBar} aria-hidden="true">
          <div className={styles.stepBarFill} />
        </div>
      </div>

      <h2 className={styles.formTitle}>Tell us about your project.</h2>

      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        {errors.form && (
          <div className={styles.serverErrorBanner} role="alert">
            <AlertCircle size={18} />
            <span>{errors.form}</span>
          </div>
        )}

        {/* Row 1: Full Name & Work Email */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="fullName" className={styles.label}>
              Full Name <span className={styles.requiredStar}>*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Your full name"
              className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
              aria-required="true"
              aria-invalid={errors.fullName ? 'true' : 'false'}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              disabled={isSubmitting}
            />
            {errors.fullName && (
              <span id="fullName-error" className={styles.errorText} role="alert">
                <AlertCircle size={13} /> {errors.fullName}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Work Email <span className={styles.requiredStar}>*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@company.com"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              aria-required="true"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              disabled={isSubmitting}
            />
            {errors.email && (
              <span id="email-error" className={styles.errorText} role="alert">
                <AlertCircle size={13} /> {errors.email}
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Company Name */}
        <div className={styles.formGroup}>
          <label htmlFor="companyName" className={styles.label}>
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Your company name"
            className={styles.input}
            disabled={isSubmitting}
          />
        </div>

        {/* Row 3: What do you need? */}
        <div className={styles.formGroup}>
          <label htmlFor="projectType" className={styles.label}>
            What do you need? <span className={styles.requiredStar}>*</span>
          </label>
          <div className={styles.selectWrapper}>
            <select
              id="projectType"
              name="projectType"
              value={selectedProjectType}
              onChange={handleProjectTypeChange}
              className={`${styles.select} ${errors.projectType ? styles.inputError : ''}`}
              aria-required="true"
              aria-invalid={errors.projectType ? 'true' : 'false'}
              aria-describedby={errors.projectType ? 'projectType-error' : undefined}
              disabled={isSubmitting}
            >
              <option value="" disabled>Select project type</option>
              {PROJECT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {errors.projectType && (
            <span id="projectType-error" className={styles.errorText} role="alert">
              <AlertCircle size={13} /> {errors.projectType}
            </span>
          )}
        </div>

        {/* Row 4: Tell us about your project */}
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            Tell us about your project <span className={styles.requiredStar}>*</span>
          </label>
          <div className={styles.textareaWrapper}>
            <textarea
              id="description"
              name="description"
              rows={4}
              maxLength={500}
              value={formData.description}
              onChange={handleChange}
              placeholder="What are you looking to create or improve?"
              className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
              aria-required="true"
              aria-invalid={errors.description ? 'true' : 'false'}
              aria-describedby={errors.description ? 'description-error' : undefined}
              disabled={isSubmitting}
            />
            <span className={styles.charCount}>
              {formData.description.length}/500
            </span>
          </div>
          {errors.description && (
            <span id="description-error" className={styles.errorText} role="alert">
              <AlertCircle size={13} /> {errors.description}
            </span>
          )}
        </div>

        {/* Row 5: Approx slides & Timeline */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="slidesCount" className={styles.label}>
              Approx. number of slides/pages
            </label>
            <input
              type="text"
              id="slidesCount"
              name="slidesCount"
              value={formData.slidesCount}
              onChange={handleChange}
              placeholder="e.g. 15 slides"
              className={styles.input}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="timeline" className={styles.label}>
              When do you need it?
            </label>
            <div className={styles.selectWrapper}>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                className={styles.select}
                disabled={isSubmitting}
              >
                {TIMELINE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Row 6: Upload Files */}
        <div className={styles.formGroup}>
          <span className={styles.label}>
            Upload your files <span className={styles.optionalTag}>(Optional)</span>
          </span>

          {!briefFile ? (
            <div
              className={`${styles.dropzone} ${isDragOver ? styles.dropzoneActive : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              aria-label="Upload files dropzone"
            >
              <input
                ref={fileInputRef}
                type="file"
                name="brief"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.webp"
                onChange={onFileInputChange}
                className={styles.hiddenFileInput}
                tabIndex={-1}
              />
              <div className={styles.dropzoneContent}>
                <div className={styles.uploadIconCircle}>
                  <UploadCloud size={24} className={styles.uploadIcon} />
                </div>
                <p className={styles.dropPrompt}>
                  Drag &amp; drop or <span className={styles.browseLink}>browse</span>
                </p>
                <span className={styles.uploadFormats}>
                  PDF, PPT, DOC, PNG, JPG (Max 10MB)
                </span>
              </div>
            </div>
          ) : (
            <div className={styles.fileSelectedBar}>
              <div className={styles.fileInfo}>
                <FileText size={20} className={styles.fileIcon} />
                <div className={styles.fileMeta}>
                  <span className={styles.fileName}>{briefFile.name}</span>
                  <span className={styles.fileSize}>{formatFileSize(briefFile.size)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className={styles.removeFileBtn}
                title="Remove attached file"
                aria-label="Remove attached file"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {errors.brief && (
            <span className={styles.errorText} role="alert">
              <AlertCircle size={13} /> {errors.brief}
            </span>
          )}
        </div>

        {/* Submit Button & Reassurance */}
        <div className={styles.submitWrapper}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitBtn}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className={styles.spinner} />
                <span>Submitting Project Inquiry...</span>
              </>
            ) : (
              <>
                <span>Submit Project Inquiry</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <p className={styles.reassuranceNote}>
            We’ll get back to you within 1 business day.
          </p>
        </div>
      </form>
    </div>
  );
}
