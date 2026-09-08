import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';
import Button from '../../common/Button/Button';
import { submitInquiry } from '../../../api/inquiries';
import styles from './ContactForm.module.css';

const PROJECT_TYPE_OPTIONS = [
  { value: '', label: 'Select project type *' },
  { value: 'PRESENTATION_DESIGN', label: 'Presentation Design (Pitch Decks, Board Materials, Keynotes)' },
  { value: 'PROPOSAL_RFP', label: 'Proposal & RFP (Bids, RFIs, Government Tenders)' },
  { value: 'BUSINESS_DOCUMENTS', label: 'Business Documents (One-Pagers, Reports, Briefs)' },
  { value: 'DATA_STORYTELLING', label: 'Data Storytelling (Dashboards, Financial Models, Infographics)' },
  { value: 'SALES_ENABLEMENT', label: 'Sales Enablement (Playbooks, One-Sheets, Battlecards)' },
  { value: 'RESEARCH', label: 'Secondary Research & Market Synthesis' },
  { value: 'OTHER', label: 'Other Visual Communication Request' }
];

const BUDGET_OPTIONS = [
  { value: '', label: 'Select budget range (optional)' },
  { value: 'Exploring / Not sure yet', label: 'Exploring / Not sure yet' },
  { value: 'Project-based (< $5,000)', label: 'Project-based (< $5,000)' },
  { value: 'Project-based ($5,000 – $15,000)', label: 'Project-based ($5,000 – $15,000)' },
  { value: 'Enterprise / Multi-deck ($15,000+)', label: 'Enterprise / Multi-deck ($15,000+)' },
  { value: 'Monthly Retainer / Dedicated Designer', label: 'Monthly Retainer / Dedicated Designer' }
];

const TIMELINE_OPTIONS = [
  { value: '', label: 'Select target timeline (optional)' },
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

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    projectType: '',
    budgetRange: '',
    timeline: '',
    description: ''
  });

  const [briefFile, setBriefFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (errors.form) {
      setErrors((prev) => ({ ...prev, form: null }));
    }
  };

  const handleFileSelection = (file) => {
    if (!file) return;

    // Check extension
    const fileName = file.name || '';
    const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setErrors((prev) => ({
        ...prev,
        brief: `Invalid file format (${ext}). Supported formats: PDF, DOC, DOCX, PPT, PPTX, PNG, JPG.`
      }));
      return;
    }

    // Check size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrors((prev) => ({
        ...prev,
        brief: `File exceeds 10MB limit (${formatFileSize(file.size)}). Please attach a smaller file.`
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

    if (!formData.projectType) {
      newErrors.projectType = 'Please select a project type.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please describe your project scope or objectives.';
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
      // Build multipart/form-data payload
      const payload = new FormData();
      payload.append('fullName', formData.fullName.trim());
      if (formData.companyName.trim()) {
        payload.append('companyName', formData.companyName.trim());
      }
      payload.append('email', formData.email.trim());
      if (formData.phone.trim()) {
        payload.append('phone', formData.phone.trim());
      }
      payload.append('projectType', formData.projectType);
      if (formData.budgetRange) {
        payload.append('budgetRange', formData.budgetRange);
      }
      if (formData.timeline) {
        payload.append('timeline', formData.timeline);
      }
      payload.append('description', formData.description.trim());

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
        form: err.message || 'Unable to submit your inquiry at this moment. Please check your connection or contact us directly at hello@slidevance.com.',
      });
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      projectType: '',
      budgetRange: '',
      timeline: '',
      description: ''
    });
    setBriefFile(null);
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className={styles.successCard} role="status" aria-live="polite">
        <div className={styles.successIconCircle}>
          <CheckCircle2 size={36} className={styles.successCheckIcon} />
        </div>
        <h3 className={styles.successHeading}>
          Thank you. Your project inquiry has been submitted successfully.
        </h3>
        <p className={styles.successMessage}>
          Our team has received your project details and will reach out within 24 hours (or faster for urgent requests).
        </p>

        <div className={styles.submissionDetails}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Client Name:</span>
            <span className={styles.detailValue}>{formData.fullName}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Contact Email:</span>
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
            Submit Another Project Inquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formCard}>
      <div className={styles.formHeader}>
        <h3 className={styles.formTitle}>Project Brief &amp; Inquiry</h3>
        <p className={styles.formSubtitle}>
          Fields marked with an asterisk (<span className={styles.requiredStar}>*</span>) are required.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        {errors.form && (
          <div className={styles.serverErrorBanner} role="alert">
            <AlertCircle size={18} />
            <span>{errors.form}</span>
          </div>
        )}

        {/* Row 1: Full Name & Company Name */}
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
              placeholder="e.g. Eleanor Vance"
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
            <label htmlFor="companyName" className={styles.label}>
              Company Name <span className={styles.optionalTag}>(Optional)</span>
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g. Apex Strategic Partners"
              className={styles.input}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Row 2: Work Email & Phone Number */}
        <div className={styles.formRow}>
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
              placeholder="name@company.com"
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

          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>
              Phone Number <span className={styles.optionalTag}>(Optional)</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className={styles.input}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Row 3: Project Type */}
        <div className={styles.formGroup}>
          <label htmlFor="projectType" className={styles.label}>
            Project Type <span className={styles.requiredStar}>*</span>
          </label>
          <div className={styles.selectWrapper}>
            <select
              id="projectType"
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className={`${styles.select} ${errors.projectType ? styles.inputError : ''}`}
              aria-required="true"
              aria-invalid={errors.projectType ? 'true' : 'false'}
              aria-describedby={errors.projectType ? 'projectType-error' : undefined}
              disabled={isSubmitting}
            >
              {PROJECT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
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

        {/* Row 4: Budget Range & Timeline */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="budgetRange" className={styles.label}>
              Budget Range <span className={styles.optionalTag}>(Optional)</span>
            </label>
            <div className={styles.selectWrapper}>
              <select
                id="budgetRange"
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleChange}
                className={styles.select}
                disabled={isSubmitting}
              >
                {BUDGET_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="timeline" className={styles.label}>
              Target Timeline <span className={styles.optionalTag}>(Optional)</span>
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
                  <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Row 5: Description */}
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            Project Description <span className={styles.requiredStar}>*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell us about your audience, objectives, number of slides or pages, key themes, or any specific constraints..."
            className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
            aria-required="true"
            aria-invalid={errors.description ? 'true' : 'false'}
            aria-describedby={errors.description ? 'description-error' : undefined}
            disabled={isSubmitting}
          />
          {errors.description && (
            <span id="description-error" className={styles.errorText} role="alert">
              <AlertCircle size={13} /> {errors.description}
            </span>
          )}
        </div>

        {/* Row 6: Upload Brief */}
        <div className={styles.formGroup}>
          <span className={styles.label}>
            Upload Project Brief <span className={styles.optionalTag}>(Optional, max 10MB)</span>
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
              aria-label="Upload brief file dropzone"
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
                <UploadCloud size={28} className={styles.uploadIcon} />
                <div className={styles.uploadText}>
                  <span className={styles.uploadPrompt}>Click to browse or drag and drop</span>
                  <span className={styles.uploadFormats}>Supported: PDF, DOC, DOCX, PPT, PPTX, PNG, JPG (max 10MB)</span>
                </div>
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

        {/* Submit Button */}
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
                <Send size={16} />
              </>
            )}
          </button>

          <span className={styles.confidentialNote}>
            Strict Confidentiality • Standard Mutual NDA Compliance
          </span>
        </div>
      </form>
    </div>
  );
}
