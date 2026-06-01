import React from 'react';

// 1. IMPORT SHADCN UI COMPONENT (Breadcrumb)
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function PageHeader({ title, breadcrumb, children }) {
    
    return (
        <div id="pageheader-container" className="flex justify-between items-center mb-8 px-2">
            <div id="pageheader-left">
                <span id="page-title" className="text-3xl font-bold block text-gray-800 mb-2">
                    {title}
                </span>
                
                {/* 2. MENGGUNAKAN KOMPONEN BREADCRUMB SHADCN */}
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/" className="text-gray-400 hover:text-orange-500 transition-colors">
                                Home
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-[#24d29d] font-semibold">
                                {Array.isArray(breadcrumb) ? breadcrumb.join(" / ") : breadcrumb}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div id="action-button" className="!flex items-center justify-end">
                {children}
            </div>
        </div>
    );
}