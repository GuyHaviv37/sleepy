interface PageFooterProps {
    children: React.ReactNode
}

export const PageFooter: React.FC<PageFooterProps> = ({children}) => {
    return (
        <div className="flex items-center absolute bottom-5">
            {children}
        </div>
    )
}