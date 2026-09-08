import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';
import Button from '../../common/Button/Button';
import { submitInquiryApi } from '../../../config/api';
import styles from './ContactForm.module.css';

const PROJECT_TYPE_OPTIONS = [
  { value: '', label: 'Select project type *' },
  { value: 'presentation', label: 'Presentation Design (Pitch Decks, Board Materials, Keynotes)' },
  { value: 'proposal', label: 'Proposal & RFP (Bids, RFIs, Government Tenders)' },
  { value: 'business_docs', label: 'Business Documents (One-Pagers, Reports, Briefs)' },
  { value: 'data_storytelling', label: 'Data Storytelling (Dashboards, Financial Models, Infographics)' },
  { value: 'sales_enablement', label: 'Sales Enablement (Playbooks, One-Sheets, Battlecards)' },
  { value: 'research', label: 'Secondary Research & Market Synthesis' },
  { value: 'dedicated_designer', label: 'Dedicated Designer / Ongoing Retainer' },
  { value: 'other', label: 'Other Visual Communication Request' }
];

const BUDGET_OPTIONS = [
  { value: '', label: 'Select budget range (optional)' },
  { value: 'not_sure', label: 'Exploring / Not sure yet' },
  { value: 'under_5k', label: 'Project-based (< $5,000)' },
  { value: '5k_to_15k', label: 'Project-based ($5,000 – $15,000)' },
  { value: 'enterprise', label: 'Enterprise / Multi-deck ($15,000+)' },
  { value: 'monthly_retainer', label: 'Monthly Retainer / Dedicated Designer' }
];

const TIMELINE_OPTIONS = [
  { value: '', label: 'Select target timeline (optional)' },
  { value: 'urgent', label: 'Urgent (Within 24–48 hours)' },
  { value: 'one_week', label: 'Within 1 week' },
  { value: 'two_weeks', label: '1 – 2 weeks' },
  { value: 'four_weeks', label: '2 – 4 weeks' },
  { value: 'flexible', label: 'Flexible / Strategic planning' }
];

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    workEmail: '',
    phoneNumber: '',
    projectType: '',
    budgetRange: '',
    timeline: '',
    projectDescription: ''
  });

  const [attachedFile, setAttachedFile] = useState(null);
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
  };

  const handleFileSelection = (file) => {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrors((prev) => ({
        ...prev,
        attachedFile: `File exceeds 25MB limit (${formatFileSize(file.size)}). Please attach a smaller file.`
      }));
      return;
    }

    // Clear file error if valid
    setErrors((prev) => ({ ...prev, attachedFile: null }));
    setAttachedFile(file);
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
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    if (!formData.workEmail.trim()) {
      newErrors.workEmail = 'Work Email is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.workEmail.trim())) {
        newErrors.workEmail = 'Please provide a valid work email address.';
      }
    }

    if (!formData.projectType) {
      newErrors.projectType = 'Please select a project type.';
    }

    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = 'Please describe your project scope or objectives.';
    } else if (formData.projectDescription.trim().length < 10) {
      newErrors.projectDescription = 'Project description must be at least 10 characters.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Focus first error field for accessibility
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
      await submitInquiryApi(formData, attachedFile);
      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err) {
      setIsSubmitting(false);
      setErrors({
        form: err.message || 'Unable to submit your inquiry at this moment. Please check your connection or contact us directly.',
      });
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      companyName: '',
      workEmail: '',
      phoneNumber: '',
      projectType: '',
      budgetRange: '',
      timeline: '',
      projectDescription: ''
    });
    setAttachedFile(null);
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
          Thank you. Your project brief has been received.
        </h3>
        <p className={styles.successMessage}>
          Our team will review your requirements and reach out within 24 hours (or faster for urgent requests).
        </p>

        <div className={styles.submissionDetails}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Client Name:</span>
            <span className={styles.detailValue}>{formData.fullName}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Work Email:</span>
            <span className={styles.detailValue}>{formData.workEmail}</span>
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
          {attachedFile && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Attached Brief:</span>
              <span className={styles.detailValue}>{attachedFile.name} ({formatFileSize(attachedFile.size)})</span>
            </div>
          )}
        </div>

        <p className={styles.devNote}>
          Note: This client-side form is ready to connect with your preferred CRM, webhook, or email backend.
        </p>

        <div className={styles.successActions}>
          <Button variant="primary" onClick={handleReset}>
            Send Another Project Brief
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
            <label htmlFor="workEmail" className={styles.label}>
              Work Email <span className={styles.requiredStar}>*</span>
            </label>
            <input
              type="email"
              id="workEmail"
              name="workEmail"
              value={formData.workEmail}
              onChange={handleChange}
              placeholder="name@company.com"
              className={`${styles.input} ${errors.workEmail ? styles.inputError : ''}`}
              aria-required="true"
              aria-invalid={errors.workEmail ? 'true' : 'false'}
              aria-describedby={errors.workEmail ? 'workEmail-error' : undefined}
              disabled={isSubmitting}
            />
            {errors.workEmail && (
              <span id="workEmail-error" className={styles.errorText} role="alert">
                <AlertCircle size={13} /> {errors.workEmail}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phoneNumber" className={styles.label}>
              Phone Number <span className={styles.optionalTag}>(Optional)</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
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

        {/* Row 5: Project Description */}
        <div className={styles.formGroup}>
          <label htmlFor="projectDescription" className={styles.label}>
            Project Description <span className={styles.requiredStar}>*</span>
          </label>
          <textarea
            id="projectDescription"
            name="projectDescription"
            rows={4}
            value={formData.projectDescription}
            onChange={handleChange}
            placeholder="Tell us about your audience, objectives, number of slides or pages, key themes, or any specific constraints..."
            className={`${styles.textarea} ${errors.projectDescription ? styles.inputError : ''}`}
            aria-required="true"
            aria-invalid={errors.projectDescription ? 'true' : 'false'}
            aria-describedby={errors.projectDescription ? 'projectDescription-error' : undefined}
            disabled={isSubmitting}
          />
          {errors.projectDescription && (
            <span id="projectDescription-error" className={styles.errorText} role="alert">
              <AlertCircle size={13} /> {errors.projectDescription}
            </span>
          )}
        </div>

        {/* Row 6: Upload Brief */}
        <div className={styles.formGroup}>
          <span className={styles.label}>
            Upload Project Brief <span className={styles.optionalTag}>(Optional, max 25MB)</span>
          </span>

          {!attachedFile ? (
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
                accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
                onChange={onFileInputChange}
                className={styles.hiddenFileInput}
                tabIndex={-1}
              />
              <div className={styles.dropzoneContent}>
                <UploadCloud size={28} className={styles.uploadIcon} />
                <div className={styles.uploadText}>
                  <span className={styles.uploadPrompt}>Click to browse or drag and drop</span>
                  <span className={styles.uploadFormats}>Supported: PDF, DOC, DOCX, PPT, PPTX, PNG, JPG</span>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.fileSelectedBar}>
              <div className={styles.fileInfo}>
                <FileText size={20} className={styles.fileIcon} />
                <div className={styles.fileMeta}>
                  <span className={styles.fileName}>{attachedFile.name}</span>
                  <span className={styles.fileSize}>{formatFileSize(attachedFile.size)}</span>
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

          {errors.attachedFile && (
            <span className={styles.errorText} role="alert">
              <AlertCircle size={13} /> {errors.attachedFile}
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
                <span>Processing Brief...</span>
              </>
            ) : (
              <>
                <span>Submit Project Brief</span>
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
