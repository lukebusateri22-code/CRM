import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Download, Zap } from 'lucide-react';
import { apiUrl } from '../config';
import { useToast } from '../contexts/ToastContext';

interface ColumnMapping {
  csvColumn: string;
  dbField: string;
  suggested: boolean;
}

interface ImportPreview {
  headers: string[];
  suggestedMapping: { [key: string]: string };
  preview: any[];
  totalRows: number;
}

function DataImport() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [mapping, setMapping] = useState<{ [key: string]: string }>({});
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);
  const { showToast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv')) {
      showToast('error', 'Please upload a CSV file');
      return;
    }

    setFile(selectedFile);
    setImportResult(null);

    // Upload for preview
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl('/api/import/preview'), {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to preview file');
      }

      const data = await response.json();
      setPreview(data);
      setMapping(data.suggestedMapping);
      showToast('success', `Analyzed ${data.totalRows} rows with AI`);
    } catch (error) {
      showToast('error', 'Failed to analyze CSV file');
      console.error(error);
    }
  };

  const handleImport = async () => {
    if (!file || !preview) return;

    setImporting(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mapping', JSON.stringify(mapping));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl('/api/import/contacts'), {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });

      if (!response.ok) {
        throw new Error('Import failed');
      }

      const result = await response.json();
      setImportResult(result);
      showToast('success', `Imported ${result.successful} contacts successfully!`);
    } catch (error) {
      showToast('error', 'Failed to import contacts');
      console.error(error);
    } finally {
      setImporting(false);
    }
  };

  const availableFields = [
    { value: 'first_name', label: 'First Name' },
    { value: 'last_name', label: 'Last Name' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'title', label: 'Job Title' },
    { value: 'company_name', label: 'Company Name' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'skip', label: '-- Skip this column --' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI-Powered Data Import</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Upload your CSV and let AI automatically map your data
          </p>
        </div>
      </div>

      {/* Upload Area */}
      {!preview && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-600'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Drop your CSV file here
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              or click to browse
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer transition-colors"
            >
              <FileText className="w-5 h-5 mr-2" />
              Choose File
            </label>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">AI Auto-Mapping</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically detects and maps your columns
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Smart Validation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Detects errors before importing
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Bulk Import</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Import thousands of records instantly
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview & Mapping */}
      {preview && !importResult && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Review AI Mapping
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {preview.totalRows} rows detected • AI suggested mappings below
              </p>
            </div>
            <button
              onClick={() => {
                setPreview(null);
                setFile(null);
                setMapping({});
              }}
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Upload Different File
            </button>
          </div>

          {/* Column Mapping Table */}
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    CSV Column
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Maps To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Sample Data
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {preview.headers.map((header, index) => (
                  <tr key={header}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {header}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={mapping[header] || 'skip'}
                        onChange={(e) => setMapping({ ...mapping, [header]: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                      >
                        {availableFields.map(field => (
                          <option key={field.value} value={field.value}>
                            {field.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate block max-w-xs">
                        {preview.preview[0]?.[header] || '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Preview Data */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Preview (First 5 Rows)
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    {preview.headers.map(header => (
                      <th key={header} className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {preview.preview.map((row, idx) => (
                    <tr key={idx}>
                      {preview.headers.map(header => (
                        <td key={header} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Import Button */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setPreview(null);
                setFile(null);
                setMapping({});
              }}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={importing}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {importing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Importing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Import {preview.totalRows} Contacts
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Import Results */}
      {importResult && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Import Complete!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your data has been successfully imported
            </p>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {importResult.successful}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Successful</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {importResult.failed}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Failed</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {importResult.totalRows}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Rows</div>
              </div>
            </div>

            {importResult.errors && importResult.errors.length > 0 && (
              <div className="mb-6 text-left">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Errors ({importResult.errors.length})
                </h3>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 max-h-40 overflow-y-auto">
                  {importResult.errors.map((error: any, idx: number) => (
                    <div key={idx} className="text-sm text-red-600 dark:text-red-400 mb-1">
                      Row {error.row}: {error.error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setImportResult(null);
                  setPreview(null);
                  setFile(null);
                  setMapping({});
                }}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Import Another File
              </button>
              <a
                href="/contacts"
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                View Contacts
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataImport;
