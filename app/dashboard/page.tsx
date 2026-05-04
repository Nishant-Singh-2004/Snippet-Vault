import Navbar from "@/components/ui/Navbar"
import SnippetForm from "@/components/ui/SnippetForm"
import styles from "./dashboard.module.css"
import SnippetList from "@/components/ui/SnippetList"

export default function Dashboard() {

  return (
    <div className={styles.container}>

      <Navbar />
      

      <div className="max-w-4xl mx-auto mt-10 space-y-6">

        <h2 className="text-2xl font-bold">
          Create New Snippet
        </h2>

        <SnippetForm />
<SnippetList />
      </div>

    </div>
  )
}