import { useState } from 'react';
import { collection, addDoc, writeBatch, doc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Upload, CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';

const JsonUploadManager = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [validationSuccess, setValidationSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [parsedData, setParsedData] = useState(null);

  // JSON Schema Validators
  const validateCategory = (category, index) => {
    const errors = [];
    if (!category.id || typeof category.id !== 'string') {
      errors.push(`Category ${index}: Missing or invalid 'id' field`);
    }
    if (!category.name || typeof category.name !== 'string') {
      errors.push(`Category ${index}: Missing or invalid 'name' field`);
    }
    if (category.iconName && typeof category.iconName !== 'string') {
      errors.push(`Category ${index}: 'iconName' must be a string`);
    }
    if (category.toolCount !== undefined && typeof category.toolCount !== 'number') {
      errors.push(`Category ${index}: 'toolCount' must be a number`);
    }
    if (category.description && typeof category.description !== 'string') {
      errors.push(`Category ${index}: 'description' must be a string`);
    }
    if (category.tools !== undefined && !Array.isArray(category.tools)) {
      errors.push(`Category ${index}: 'tools' must be an array`);
    }
    return errors;
  };

  const validateWorkflow = (workflow, index) => {
    const errors = [];
    if (!workflow.id || typeof workflow.id !== 'string') {
      errors.push(`Workflow ${index}: Missing or invalid 'id' field`);
    }
    if (!workflow.name || typeof workflow.name !== 'string') {
      errors.push(`Workflow ${index}: Missing or invalid 'name' field`);
    }
    if (workflow.description && typeof workflow.description !== 'string') {
      errors.push(`Workflow ${index}: 'description' must be a string`);
    }
    if (workflow.iconName && typeof workflow.iconName !== 'string') {
      errors.push(`Workflow ${index}: 'iconName' must be a string`);
    }
    if (workflow.duration && typeof workflow.duration !== 'string') {
      errors.push(`Workflow ${index}: 'duration' must be a string`);
    }
    if (workflow.steps !== undefined && typeof workflow.steps !== 'number') {
      errors.push(`Workflow ${index}: 'steps' must be a number`);
    }
    if (workflow.tags !== undefined && !Array.isArray(workflow.tags)) {
      errors.push(`Workflow ${index}: 'tags' must be an array`);
    }
    if (workflow.journey) {
      if (!Array.isArray(workflow.journey)) {
        errors.push(`Workflow ${index}: 'journey' must be an array`);
      } else {
        workflow.journey.forEach((step, stepIndex) => {
          if (!step.title || typeof step.title !== 'string') {
            errors.push(`Workflow ${index}, Step ${stepIndex + 1}: Missing or invalid 'title' field`);
          }
          if (step.description && typeof step.description !== 'string') {
            errors.push(`Workflow ${index}, Step ${stepIndex + 1}: 'description' must be a string`);
          }
          if (step.toolId && typeof step.toolId !== 'string') {
            errors.push(`Workflow ${index}, Step ${stepIndex + 1}: 'toolId' must be a string`);
          }
        });
      }
    }
    return errors;
  };

  const validateTool = (tool, index) => {
    const errors = [];
    if (!tool.id || typeof tool.id !== 'string') {
      errors.push(`Tool ${index}: Missing or invalid 'id' field`);
    }
    if (!tool.name || typeof tool.name !== 'string') {
      errors.push(`Tool ${index}: Missing or invalid 'name' field`);
    }
    if (!tool.category || typeof tool.category !== 'string') {
      errors.push(`Tool ${index}: Missing or invalid 'category' field`);
    }
    if (tool.shortDescription && typeof tool.shortDescription !== 'string') {
      errors.push(`Tool ${index}: 'shortDescription' must be a string`);
    }
    if (tool.longDescription && typeof tool.longDescription !== 'string') {
      errors.push(`Tool ${index}: 'longDescription' must be a string`);
    }
    if (tool.url && typeof tool.url !== 'string') {
      errors.push(`Tool ${index}: 'url' must be a string`);
    }
    if (tool.logoUrl && typeof tool.logoUrl !== 'string') {
      errors.push(`Tool ${index}: 'logoUrl' must be a string`);
    }
    if (tool.pricing && typeof tool.pricing !== 'string') {
      errors.push(`Tool ${index}: 'pricing' must be a string`);
    }
    if (tool.tags && !Array.isArray(tool.tags)) {
      errors.push(`Tool ${index}: 'tags' must be an array`);
    }
    if (tool.isTrending !== undefined && typeof tool.isTrending !== 'boolean') {
      errors.push(`Tool ${index}: 'isTrending' must be a boolean`);
    }
    if (tool.likesCount !== undefined && typeof tool.likesCount !== 'number') {
      errors.push(`Tool ${index}: 'likesCount' must be a number`);
    }
    return errors;
  };

  const validateJson = (data) => {
    const errors = [];

    if (!data || typeof data !== 'object') {
      errors.push('Root must be an object');
      return errors;
    }

    // Validate categories
    if (data.categories) {
      if (!Array.isArray(data.categories)) {
        errors.push("'categories' must be an array");
      } else {
        data.categories.forEach((category, index) => {
          errors.push(...validateCategory(category, index + 1));
        });
      }
    }

    // Validate workflows
    if (data.workflows) {
      if (!Array.isArray(data.workflows)) {
        errors.push("'workflows' must be an array");
      } else {
        data.workflows.forEach((workflow, index) => {
          errors.push(...validateWorkflow(workflow, index + 1));
        });
      }
    }

    // Validate tools
    if (data.tools) {
      if (!Array.isArray(data.tools)) {
        errors.push("'tools' must be an array");
      } else {
        data.tools.forEach((tool, index) => {
          errors.push(...validateTool(tool, index + 1));
        });
      }
    }

    // Check if at least one collection is provided
    if (!data.categories && !data.workflows && !data.tools) {
      errors.push('At least one of "categories", "workflows", or "tools" must be provided');
    }

    return errors;
  };

  const handleValidate = () => {
    setValidationErrors([]);
    setValidationSuccess(false);
    setParsedData(null);
    setUploadStatus(null);

    try {
      const parsed = JSON.parse(jsonInput);
      const errors = validateJson(parsed);

      if (errors.length > 0) {
        setValidationErrors(errors);
        setValidationSuccess(false);
      } else {
        setValidationErrors([]);
        setValidationSuccess(true);
        setParsedData(parsed);
      }
    } catch (error) {
      setValidationErrors([`Invalid JSON: ${error.message}`]);
      setValidationSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!parsedData || validationErrors.length > 0) {
      alert('Please validate the JSON first');
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      const batch = writeBatch(db);
      let uploadCount = 0;
      const statusMessages = [];

      // Upload categories
      if (parsedData.categories && parsedData.categories.length > 0) {
        // Check for existing categories to avoid duplicates
        const existingCategoriesSnapshot = await getDocs(collection(db, 'categories'));
        const existingCategoryIds = new Set(
          existingCategoriesSnapshot.docs.map(doc => doc.id)
        );

        let categoryCount = 0;
        for (const category of parsedData.categories) {
          // Check if category with same id already exists
          if (!existingCategoryIds.has(category.id)) {
            // Use the id field as the document ID
            const categoryRef = doc(db, 'categories', category.id);
            batch.set(categoryRef, {
              ...category,
              enabled: category.enabled !== undefined ? category.enabled : true,
              updatedAt: serverTimestamp()
            });
            categoryCount++;
          } else {
            statusMessages.push(`Category "${category.name}" (id: ${category.id}) already exists, skipping`);
          }
        }
        uploadCount += categoryCount;
        statusMessages.push(`Categories: ${categoryCount} new entries prepared`);
      }

      // Upload workflows
      if (parsedData.workflows && parsedData.workflows.length > 0) {
        const existingWorkflowsSnapshot = await getDocs(collection(db, 'workflows'));
        const existingWorkflowIds = new Set(
          existingWorkflowsSnapshot.docs.map(doc => doc.id)
        );

        let workflowCount = 0;
        for (const workflow of parsedData.workflows) {
          if (!existingWorkflowIds.has(workflow.id)) {
            // Use the id field as the document ID
            const workflowRef = doc(db, 'workflows', workflow.id);
            batch.set(workflowRef, {
              ...workflow,
              steps: workflow.steps || (workflow.journey?.length || 0),
              updatedAt: serverTimestamp()
            });
            workflowCount++;
          } else {
            statusMessages.push(`Workflow "${workflow.name}" (id: ${workflow.id}) already exists, skipping`);
          }
        }
        uploadCount += workflowCount;
        statusMessages.push(`Workflows: ${workflowCount} new entries prepared`);
      }

      // Upload tools
      if (parsedData.tools && parsedData.tools.length > 0) {
        const existingToolsSnapshot = await getDocs(collection(db, 'tools'));
        const existingToolIds = new Set(
          existingToolsSnapshot.docs.map(doc => doc.id)
        );

        let newToolCount = 0;
        let updatedToolCount = 0;
        for (const tool of parsedData.tools) {
          // Use the id field as the document ID
          const toolRef = doc(db, 'tools', tool.id);
          const isNew = !existingToolIds.has(tool.id);

          batch.set(toolRef, {
            ...tool,
            enabled: tool.enabled !== undefined ? tool.enabled : true,
            updatedAt: serverTimestamp()
          }, { merge: false }); // Use set to replace entire document

          if (isNew) {
            newToolCount++;
          } else {
            updatedToolCount++;
          }
        }
        uploadCount += newToolCount + updatedToolCount;
        if (newToolCount > 0 && updatedToolCount > 0) {
          statusMessages.push(`Tools: ${newToolCount} new entries, ${updatedToolCount} updated`);
        } else if (newToolCount > 0) {
          statusMessages.push(`Tools: ${newToolCount} new entries`);
        } else if (updatedToolCount > 0) {
          statusMessages.push(`Tools: ${updatedToolCount} entries updated`);
        }
      }

      if (uploadCount === 0) {
        setUploadStatus({
          type: 'warning',
          message: 'No new entries to upload. All items already exist in the database.',
          details: statusMessages
        });
      } else {
        await batch.commit();
        setUploadStatus({
          type: 'success',
          message: `Successfully uploaded ${uploadCount} new entries!`,
          details: statusMessages
        });
        // Clear the input after successful upload
        setJsonInput('');
        setParsedData(null);
        setValidationSuccess(false);
      }
    } catch (error) {
      console.error('Error uploading data:', error);
      setUploadStatus({
        type: 'error',
        message: `Error uploading data: ${error.message}`,
        details: []
      });
    } finally {
      setUploading(false);
    }
  };

  const loadExample = () => {
    const example = {
      "categories": [
        {
          "id": "ai___machine_learning",
          "name": "AI & MACHINE LEARNING",
          "iconName": "folder",
          "toolCount": 10,
          "description": "AI & MACHINE LEARNING",
          "tools": [
            "chatgpt",
            "midjourney"
          ]
        }
      ],
      "workflows": [
        {
          "id": "startup_pack",
          "name": "Startup Launch Pack",
          "description": "Launch your startup in 6 strategic steps.",
          "iconName": "rocket",
          "duration": "3 hours",
          "steps": 6,
          "journey": [
            {
              "title": "Business Planning",
              "description": "Generate business plan and market analysis",
              "toolId": "chatgpt"
            }
          ],
          "tags": [
            "Startup",
            "Business",
            "Planning",
            "Launch",
            "AI Tools"
          ]
        }
      ],
      "tools": [
        {
          "id": "chatgpt",
          "name": "ChatGPT",
          "category": "chatbots",
          "shortDescription": "Advanced conversational AI",
          "longDescription": "ChatGPT offers conversational access to OpenAI's GPT family.",
          "url": "https://chat.openai.com",
          "logoUrl": "https://logo.clearbit.com/chat.openai.com",
          "pricing": "Freemium",
          "tags": ["LLM", "Chat", "Code"],
          "isTrending": true,
          "likesCount": 15000
        }
      ]
    };
    setJsonInput(JSON.stringify(example, null, 2));
    setValidationErrors([]);
    setValidationSuccess(false);
    setUploadStatus(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">JSON Data Upload</h1>
        <button
          onClick={loadExample}
          className="flex items-center gap-2 px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-colors"
        >
          Load Example
        </button>
      </div>

      <div className="space-y-6">
        {/* JSON Input Area */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">JSON Input</h2>
            <button
              onClick={handleValidate}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
            >
              <CheckCircle className="w-5 h-5" />
              Validate JSON
            </button>
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => {
              setJsonInput(e.target.value);
              setValidationErrors([]);
              setValidationSuccess(false);
              setUploadStatus(null);
            }}
            placeholder='Paste your JSON data here. Example format: { "categories": [...], "workflows": [...], "tools": [...] }'
            className="w-full h-96 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white font-mono text-sm"
          />
        </div>

        {/* Validation Results */}
        {validationErrors.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-semibold text-red-400">Validation Errors</h3>
            </div>
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-red-300 text-sm flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {validationSuccess && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-semibold text-green-400">Validation Successful!</h3>
            </div>
            <div className="text-green-300 text-sm space-y-1">
              {parsedData?.categories && (
                <p>• Categories: {parsedData.categories.length} entries</p>
              )}
              {parsedData?.workflows && (
                <p>• Workflows: {parsedData.workflows.length} entries</p>
              )}
              {parsedData?.tools && (
                <p>• Tools: {parsedData.tools.length} entries</p>
              )}
            </div>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-4 flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload to Database
                </>
              )}
            </button>
          </div>
        )}

        {/* Upload Status */}
        {uploadStatus && (
          <div
            className={`border rounded-xl p-6 ${uploadStatus.type === 'success'
              ? 'bg-green-500/10 border-green-500/30'
              : uploadStatus.type === 'error'
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-yellow-500/10 border-yellow-500/30'
              }`}
          >
            <div className="flex items-center gap-3 mb-4">
              {uploadStatus.type === 'success' ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : uploadStatus.type === 'error' ? (
                <XCircle className="w-6 h-6 text-red-400" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-400" />
              )}
              <h3
                className={`text-xl font-semibold ${uploadStatus.type === 'success'
                  ? 'text-green-400'
                  : uploadStatus.type === 'error'
                    ? 'text-red-400'
                    : 'text-yellow-400'
                  }`}
              >
                {uploadStatus.type === 'success'
                  ? 'Upload Successful'
                  : uploadStatus.type === 'error'
                    ? 'Upload Failed'
                    : 'Upload Warning'}
              </h3>
            </div>
            <p
              className={`text-sm mb-2 ${uploadStatus.type === 'success'
                ? 'text-green-300'
                : uploadStatus.type === 'error'
                  ? 'text-red-300'
                  : 'text-yellow-300'
                }`}
            >
              {uploadStatus.message}
            </p>
            {uploadStatus.details && uploadStatus.details.length > 0 && (
              <ul className="mt-3 space-y-1 max-h-48 overflow-y-auto">
                {uploadStatus.details.map((detail, index) => (
                  <li
                    key={index}
                    className={`text-xs ${uploadStatus.type === 'success'
                      ? 'text-green-300/80'
                      : uploadStatus.type === 'error'
                        ? 'text-red-300/80'
                        : 'text-yellow-300/80'
                      }`}
                  >
                    • {detail}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Instructions</h3>
          <ul className="space-y-2 text-sm text-soft-grey">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">1.</span>
              <span>Paste your JSON data in the text area above. The JSON should contain one or more of: "categories", "workflows", or "tools" arrays.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">2.</span>
              <span>Click "Validate JSON" to check if your data matches the required schema.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">3.</span>
              <span>If validation is successful, click "Upload to Database" to add the data to Firestore.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">4.</span>
              <span>Duplicate entries (based on "id" field) will be skipped automatically.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JsonUploadManager;
