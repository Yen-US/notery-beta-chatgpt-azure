'use client'
import { Button } from "@/components/ui/button";
export default function Footer() {

    const openInNewTab = (url: string | URL | undefined) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <footer className="flex items-center justify-center p-6">
            <span>Made with ❤ by</span>
            <Button className="text-sm ml-2" size='sm' onClick={()=>openInNewTab('https://www.yenus.dev')}> @yenus.dev</Button>
        </footer>
    );
}
