'use client';

import React, { useState, useEffect } from 'react';
import { useAIGuidelines, useUpdateAIGuidelines } from '@/stores/knowledgeBaseStore';
import { useAppToast } from '@/hooks/useAppToast';

interface GuidelinesEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuidelinesEditorModal({ isOpen, onClose }: GuidelinesEditorModalProps) {
  const aiGuidelines = useAIGuidelines();
  const updateAIGuidelines = useUpdateAIGuidelines();
  const toast = useAppToast();
  
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load current content when modal opens
  useEffect(() => {
    if (isOpen) {
      setContent(aiGuidelines.content || '');
    }
  }, [isOpen, aiGuidelines.content]);

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error('Please enter some guidelines');
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate save process
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateAIGuidelines(content.trim());
      toast.success('AI Guidelines updated successfully');
      onClose();
    } catch (_error) {
      toast.error('Failed to save guidelines. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(aiGuidelines.content || '');
    onClose();
  };

  const guidelineTemplates = [
    {
      title: "Tone & Style",
      content: "Always maintain a friendly, professional, and helpful tone. Use simple language that customers can easily understand."
    },
    {
      title: "Response Format",
      content: "Keep responses concise but informative. Use bullet points for lists and break down complex information into digestible parts."
    },
    {
      title: "Escalation Rules",
      content: "If you cannot answer a question or if the customer seems frustrated, politely offer to connect them with a human agent."
    },
    {
      title: "Business Hours",
      content: "Always mention business hours when relevant. If contacted outside business hours, let customers know when they can expect a response."
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box rounded-2xl max-w-6xl max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold text-base-content">Edit AI Guidelines</h3>
            <p className="text-sm text-base-content/70 mt-1">
              Customize how your AI chatbot should behave and respond to customers
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="btn btn-ghost btn-sm rounded-2xl"
            disabled={isSaving}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="label">
                <span className="label-text font-medium">AI Guidelines</span>
                <span className="label-text-alt text-base-content/60">
                  {content.length} characters
                </span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="textarea textarea-bordered w-full h-96 text-brand-body resize-none rounded-2xl font-mono text-sm"
                placeholder="Enter your AI guidelines here..."
                disabled={isSaving}
              />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setContent('')}
                className="btn btn-outline btn-sm rounded-2xl"
                disabled={isSaving}
              >
                Clear All
              </button>
              <button
                onClick={() => {
                  const template = `You are a helpful customer service assistant for this business.

TONE & STYLE:
- Always maintain a friendly, professional, and helpful tone
- Use simple language that customers can easily understand
- Be empathetic and patient with customer concerns

RESPONSE GUIDELINES:
- Keep responses concise but informative
- Use bullet points for lists when appropriate
- Break down complex information into digestible parts
- Always double-check information before providing it

ESCALATION RULES:
- If you cannot answer a question, admit it honestly
- If the customer seems frustrated, offer to connect them with a human agent
- For complex technical issues, recommend speaking with a specialist

BUSINESS INFORMATION:
- Always mention business hours when relevant
- Provide accurate contact information when requested
- Reference company policies accurately

Remember: Your goal is to help customers efficiently while representing the business professionally.`;
                  setContent(template);
                }}
                className="btn btn-outline btn-sm rounded-2xl"
                disabled={isSaving}
              >
                Load Template
              </button>
            </div>
          </div>

          {/* Templates & Tips */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-base-content mb-3">Quick Templates</h4>
              <div className="space-y-2">
                {guidelineTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const newContent = content ? `${content}\n\n${template.title.toUpperCase()}:\n${template.content}` : `${template.title.toUpperCase()}:\n${template.content}`;
                      setContent(newContent);
                    }}
                    className="w-full text-left p-3 bg-base-200 hover:bg-base-300 rounded-2xl transition-colors"
                    disabled={isSaving}
                  >
                    <div className="font-medium text-sm text-base-content">{template.title}</div>
                    <div className="text-xs text-base-content/70 mt-1 line-clamp-2">{template.content}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-info/10 border border-info/20 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-info flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-info">Tips for effective guidelines:</p>
                  <ul className="text-xs text-info/80 mt-1 space-y-1">
                    <li>• Be specific about tone and communication style</li>
                    <li>• Include escalation procedures for complex issues</li>
                    <li>• Mention business hours and contact information</li>
                    <li>• Set clear boundaries on what the AI can/cannot do</li>
                    <li>• Include examples of good responses when possible</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Character Count */}
            <div className="bg-base-200 rounded-2xl p-4">
              <div className="text-sm text-base-content/70">
                <div className="flex justify-between items-center">
                  <span>Character Count:</span>
                  <span className="font-mono">{content.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Word Count:</span>
                  <span className="font-mono">{content.trim().split(/\s+/).filter(word => word.length > 0).length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="modal-action">
          <button
            onClick={handleCancel}
            className="btn btn-ghost rounded-2xl"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn bg-brand-orange hover:bg-brand-orange-light text-white rounded-2xl"
            disabled={isSaving || !content.trim()}
          >
            {isSaving && <span className="loading loading-spinner loading-sm"></span>}
            {isSaving ? 'Saving...' : 'Save Guidelines'}
          </button>
        </div>
      </div>
    </div>
  );
}
