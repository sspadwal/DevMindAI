import React, { useState } from 'react'
import Markdown from 'react-markdown'
import { ChevronDown, ChevronUp, Calendar, Image, FileText } from 'lucide-react'

const CreationItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  // Safely handle date formatting
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Unknown date';
    }
  };

  // Get type-specific icon and color
  const getTypeConfig = (type) => {
    switch (type?.toLowerCase()) {
      case 'image':
        return {
          icon: Image,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-700'
        };
      case 'text':
        return {
          icon: FileText,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700'
        };
      default:
        return {
          icon: FileText,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-700'
        };
    }
  };

  const typeConfig = getTypeConfig(item?.type);
  const TypeIcon = typeConfig.icon;

  if (!item) {
    return (
      <div className='p-4 bg-gray-50 border border-gray-200 rounded-lg'>
        <p className='text-gray-500'>Invalid creation data</p>
      </div>
    );
  }

  return (
    <div className='bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow'>
      {/* Header - Always Visible */}
      <div 
        onClick={() => setExpanded(!expanded)} 
        className='p-4 cursor-pointer hover:bg-gray-50 transition-colors'
      >
        <div className='flex justify-between items-start gap-4'>
          <div className='flex-1 min-w-0'>
            <div className='flex items-start gap-3'>
              <div className='flex-shrink-0 mt-1'>
                <TypeIcon className='w-5 h-5 text-gray-500' />
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='font-medium text-gray-900 line-clamp-2 mb-1'>
                  {item.prompt || 'No description available'}
                </h3>
                <div className='flex items-center gap-4 text-sm text-gray-500'>
                  <div className='flex items-center gap-1'>
                    <Calendar className='w-4 h-4' />
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                  {item.publish && (
                    <span className='px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full'>
                      Public
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-2 flex-shrink-0'>
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${typeConfig.bgColor} ${typeConfig.borderColor} ${typeConfig.textColor} border`}>
              {item.type || 'unknown'}
            </span>
            <div className='p-1'>
              {expanded ? (
                <ChevronUp className='w-4 h-4 text-gray-400' />
              ) : (
                <ChevronDown className='w-4 h-4 text-gray-400' />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className='border-t border-gray-100'>
          <div className='p-4'>
            {item.type === "image" ? (
              <div className='space-y-3'>
                <h4 className='font-medium text-gray-700'>Generated Image:</h4>
                <div className='rounded-lg overflow-hidden bg-gray-50 border border-gray-200'>
                  <img 
                    src={item.content} 
                    alt={item.prompt || "Generated image"} 
                    className='w-full max-w-md mx-auto object-contain'
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div 
                    className='hidden p-8 text-center text-gray-500'
                    style={{ display: 'none' }}
                  >
                    <Image className='w-12 h-12 mx-auto mb-2 text-gray-300' />
                    <p>Image could not be loaded</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className='space-y-3'>
                <h4 className='font-medium text-gray-700'>Generated Content:</h4>
                <div className='max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg border border-gray-200'>
                  <div className='prose prose-sm max-w-none'>
                    <Markdown>
                      {item.content || 'No content available'}
                    </Markdown>
                  </div>
                </div>
              </div>
            )}

            {/* Additional metadata */}
            {item.likes && Array.isArray(item.likes) && item.likes.length > 0 && (
              <div className='mt-4 pt-4 border-t border-gray-100'>
                <p className='text-sm text-gray-500'>
                  ❤️ {item.likes.length} {item.likes.length === 1 ? 'like' : 'likes'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreationItem;