import React from 'react'
import { PricingTable } from '@clerk/clerk-react'

const Plan = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-20">
      {/* Header */}
      <div className="text-center mb-12">
        
        <h2 className="text-slate-800 text-4xl sm:text-5xl font-bold mb-4">
          Choose Your {" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
            Plan
          </span>
        </h2>
        <p className="text-gray-500 text-lg max-w-lg mx-auto">
          Start for free and scale up as you grow. Find the perfect plan for your content creation needs.
        </p>
      </div>

      {/* Pricing Table Container */}
      <div className="mt-10">
        <div className="[&_.cl-pricingTable]:flex [&_.cl-pricingTable]:flex-col [&_.cl-pricingTable]:md:flex-row [&_.cl-pricingTable]:gap-8 [&_.cl-pricingTable]:justify-center [&_.cl-pricingTable]:max-w-5xl [&_.cl-pricingTable]:mx-auto">
          {/* Card Styling */}
          <div className="[&_.cl-pricingTableCard]:w-full [&_.cl-pricingTableCard]:md:w-96 [&_.cl-pricingTableCard]:bg-white [&_.cl-pricingTableCard]:rounded-xl [&_.cl-pricingTableCard]:shadow-lg [&_.cl-pricingTableCard]:border [&_.cl-pricingTableCard]:border-gray-200 [&_.cl-pricingTableCard]:p-8 [&_.cl-pricingTableCard]:transition-all [&_.cl-pricingTableCard]:duration-300 [&_.cl-pricingTableCard]:hover:shadow-xl [&_.cl-pricingTableCard]:hover:-translate-y-1">
            
            {/* Premium Card Specific Styling */}
            <div className="[&_.cl-pricingTableCard__premium]:border-2 [&_.cl-pricingTableCard__premium]:border-blue-500 [&_.cl-pricingTableCard__premium]:bg-gradient-to-b [&_.cl-pricingTableCard__premium]:from-blue-50/50 [&_.cl-pricingTableCard__premium]:to-white">
              
              {/* Header Styling */}
              <div className="[&_.cl-pricingTableCardHeader]:mb-6">
                <div className="[&_.cl-pricingTableCardTitleContainer]:flex [&_.cl-pricingTableCardTitleContainer]:justify-between [&_.cl-pricingTableCardTitleContainer]:items-start">
                  <div className="[&_.cl-pricingTableCardTitle]:text-2xl [&_.cl-pricingTableCardTitle]:font-bold [&_.cl-pricingTableCardTitle]:text-gray-800 [&_.cl-pricingTableCard__premium_.cl-pricingTableCardTitle]:text-blue-600">
                    
                    {/* Badge Styling */}
                    <div className="[&_.cl-badge]:px-3 [&_.cl-badge]:py-1 [&_.cl-badge]:text-xs [&_.cl-badge]:font-semibold [&_.cl-badge]:rounded-full [&_.cl-badge]:uppercase [&_.cl-badge]:tracking-wide">
                      <div className="[&_[data-color='primary']]:bg-blue-100 [&_[data-color='primary']]:text-blue-800 [&_[data-color='secondary']]:bg-green-100 [&_[data-color='secondary']]:text-green-800"></div>
                    </div>
                  </div>
                </div>
                
                {/* Price Styling */}
                <div className="[&_.cl-pricingTableCardFeeContainer]:mt-4 [&_.cl-pricingTableCardFeeContainer]:flex [&_.cl-pricingTableCardFeeContainer]:items-baseline">
                  <div className="[&_.cl-pricingTableCardFee]:text-4xl [&_.cl-pricingTableCardFee]:font-bold [&_.cl-pricingTableCardFee]:text-gray-800"></div>
                  <div className="[&_.cl-pricingTableCardFeePeriod]:text-gray-500 [&_.cl-pricingTableCardFeePeriod]:ml-2 [&_.cl-pricingTableCardFeePeriod]:text-lg"></div>
                </div>
                <div className="[&_.cl-pricingTableCardFeePeriodNotice]:text-gray-500 [&_.cl-pricingTableCardFeePeriodNotice]:mt-1 [&_.cl-pricingTableCardFeePeriodNotice]:text-sm"></div>
              </div>
              
              {/* Features List Styling */}
              <div className="[&_.cl-pricingTableCardFeaturesList]:space-y-4 [&_.cl-pricingTableCardFeaturesList]:my-8">
                <div className="[&_.cl-pricingTableCardFeaturesListItem]:flex [&_.cl-pricingTableCardFeaturesListItem]:items-start">
                  <div className="[&_svg]:w-5 [&_svg]:h-5 [&_svg]:mr-3 [&_svg]:mt-0.5 [&_svg]:text-blue-500 [&_svg]:flex-shrink-0"></div>
                  <div className="[&_.cl-pricingTableCardFeaturesListItemTitle]:text-gray-600 [&_.cl-pricingTableCardFeaturesListItemTitle]:text-base"></div>
                </div>
              </div>
              
              {/* Footer Styling */}
              <div className="[&_.cl-pricingTableCardFooter]:mt-6">
                <div className="[&_.cl-pricingTableCardFooterNotice]:text-gray-400 [&_.cl-pricingTableCardFooterNotice]:text-sm [&_.cl-pricingTableCardFooterNotice]:mb-4"></div>
                <div className="[&_.cl-pricingTableCardFooterButton]:w-full [&_.cl-pricingTableCardFooterButton]:py-3 [&_.cl-pricingTableCardFooterButton]:px-6 [&_.cl-pricingTableCardFooterButton]:rounded-lg [&_.cl-pricingTableCardFooterButton]:font-semibold [&_.cl-pricingTableCardFooterButton]:transition-colors [&_.cl-pricingTableCardFooterButton]:duration-200">
                  <div className="[&_[data-variant='solid']]:bg-gradient-to-r [&_[data-variant='solid']]:from-blue-600 [&_[data-variant='solid']]:to-blue-500 [&_[data-variant='solid']]:text-white [&_[data-variant='solid']]:hover:from-blue-700 [&_[data-variant='solid']]:hover:to-blue-600 [&_[data-variant='solid']]:shadow-md"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Render the Clerk PricingTable */}
        <PricingTable />
      </div>
    </div>
  )
}

export default Plan