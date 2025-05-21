"use client"
import { useRouter } from "next/navigation"
import ProjectManagement from "@/project-management"
import { Button } from "@/components/ui/button"
import { BarChart3, LineChart, PlusCircle } from "lucide-react"

export default function ProjectsPage() {
  const router = useRouter()

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        {/* <div>
            <Button onClick={() => router.push("/projects/add")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </div> */}
         <ProjectManagement />
        </div>
       
    </>
  )
}
