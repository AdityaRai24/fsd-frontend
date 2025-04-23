// Import the DeleteExperimentDialog component
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Users,
  Beaker,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Settings,
  LogOut,
} from "lucide-react";

import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const defaultData = {
  teams: [
    {
      name: "Full Stack Development",
      logo: GalleryVerticalEnd,
    },
    {
      name: "Devops",
      logo: AudioWaveform,
    },
  ],
};

export function AppSidebar({ teacher, ...props }) {
  const [searchParams] = useSearchParams();
  const [teamsData, setTeamsData] = useState(null);
  const [experiments, setExperiments] = useState([]);
  const [isExperimentsOpen, setIsExperimentsOpen] = useState(false);
  const [newExperimentName, setNewExperimentName] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  // Add state for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [experimentToDelete, setExperimentToDelete] = useState({
    index: -1,
    name: "",
  });

  const subject = searchParams.get("sub");
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedData = JSON.parse(localStorage.getItem("allData"));
      if (
        storedData &&
        storedData.batches &&
        storedData.batches[0] &&
        storedData.batches[0].subjects
      ) {
        setTeamsData(storedData.batches[0].subjects);
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      setTeamsData(defaultData.teams);
    }
  }, []);

  const subjectsWithLogos = useMemo(() => {
    if (!teamsData) return [];
    const icons = [
      GalleryVerticalEnd,
      AudioWaveform,
      BookOpen,
      Bot,
      Command,
      Frame,
      Map,
      PieChart,
      Settings2,
      SquareTerminal,
    ];
    return teamsData.map((subject, index) => ({
      ...subject,
      logo: icons[index % icons.length],
    }));
  }, [teamsData]);

  const [activeTeam, setActiveTeam] = useState(null);

  useEffect(() => {
    if (subjectsWithLogos.length > 0) {
      const currentTeam = subject
        ? subjectsWithLogos.find((team) => team.name === subject)
        : subjectsWithLogos[0];

      setActiveTeam(currentTeam || subjectsWithLogos[0]);
    }
  }, [subject, subjectsWithLogos]);

  useEffect(() => {
    const fetchExperiments = async () => {
      if (!activeTeam) return;

      try {
        const token = localStorage.getItem("token");
        const allData = JSON.parse(localStorage.getItem("allData"));
        const currentBatch = allData.batches[0];

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/experiments?subject=${activeTeam.name}&batch=${currentBatch._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const sortedExperiments = response.data.sort((a, b) => {
          const numA = parseInt(a.name.match(/\d+/)?.[0] || 0);
          const numB = parseInt(b.name.match(/\d+/)?.[0] || 0);
          return numA - numB;
        });

        setExperiments(sortedExperiments);
      } catch (error) {
        console.error("Error fetching experiments:", error);
        setExperiments([]);
      }
    };

    fetchExperiments();
  }, [activeTeam]);

  const handleSubChange = (team) => {
    setActiveTeam(team);
    navigate(`/teacher-dashboard?sub=${team.name}`);
  };

  const handleExperimentClick = (index) => {
    navigate(
      `/teacher-dashboard?exp=${experiments[index]._id}&sub=${activeTeam.name}`
    );
  };

  const handleAddExperiment = async () => {
    if (newExperimentName.trim()) {
      try {
        const token = localStorage.getItem("token");
        const allData = JSON.parse(localStorage.getItem("allData"));
        const currentBatch = allData.batches[0];

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/experiments`,
          {
            name: newExperimentName.trim(),
            subject: activeTeam.name,
            batch: currentBatch._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update local state with the new experiment from the response
        setExperiments([...experiments, response.data]);
        setNewExperimentName("");
        setIsAddDialogOpen(false);
      } catch (error) {
        console.error("Error adding experiment:", error);
      }
    }
  };

  // Updated delete handling
  const handleDeleteClick = (index, name) => {
    setExperimentToDelete({ index, name });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const experiment = experiments[experimentToDelete.index];

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/experiments/${experiment._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state by removing the deleted experiment
      setExperiments(
        experiments.filter((_, index) => index !== experimentToDelete.index)
      );
      setDeleteDialogOpen(false);
      setExperimentToDelete({ index: -1, name: "" });
    } catch (error) {
      console.error("Error deleting experiment:", error);
    }
  };

  const handleRubricsSettings = async () => {
    if (!subject) {
      toast.error("No subject selected");
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/subjects/name/${subject}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate(`/rubrics-settings/${response.data._id}`);
    } catch (err) {
      toast.error("Failed to fetch subject details");
      console.error("Error fetching subject:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          activeTeam={activeTeam}
          handleSubChange={handleSubChange}
          teams={subjectsWithLogos}
        />
      </SidebarHeader>
      <SidebarContent className="flex flex-col space-y-1">
        {/* View Students Button */}
        {/* <Button
          variant="ghost"
          className="justify-start gap-2 h-10 px-4 py-2 w-full"
          onClick={handleViewStudents}
        >
          <Users size={18} />
          <span>View Students</span>
        </Button> */}

        {/* Experiments Dropdown */}
        <Collapsible
          open={isExperimentsOpen}
          onOpenChange={setIsExperimentsOpen}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="justify-start gap-2 h-10 px-4 py-2 w-full"
            >
              <Beaker size={18} />
              <span className="flex-1 text-left">View Experiments</span>
              {isExperimentsOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="pl-9 pr-2">
            <div className="flex flex-col space-y-1 py-2">
              {experiments.map((experiment, index) => (
                <div key={experiment._id} className="flex items-center group">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start h-9 text-sm w-full text-left"
                    onClick={() => handleExperimentClick(index)}
                  >
                    {experiment.name}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteClick(index, experiment.name)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full justify-center gap-1"
                  >
                    <Plus size={14} />
                    Add Experiment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Experiment</DialogTitle>
                    <DialogDescription>
                      Enter a name for the new experiment.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="experiment-name">Experiment Name</Label>
                    <Input
                      id="experiment-name"
                      value={newExperimentName}
                      onChange={(e) => setNewExperimentName(e.target.value)}
                      placeholder="e.g. Experiment 11"
                      className="mt-2"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddExperiment}>
                      Add Experiment
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Rubrics Settings Button - now placed after View Experiments */}
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={handleRubricsSettings}
            className="flex w-full items-center justify-start gap-2"
          >
            <Settings className="h-4 w-4" />
            Rubrics Settings
          </Button>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser teacher={teacher} handleLogout={handleLogout} />
      </SidebarFooter>
      <SidebarRail />

      {/* Delete Confirmation Dialog */}
      <DeleteExperimentDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        experimentName={experimentToDelete.name}
      />
    </Sidebar>
  );
}

function DeleteExperimentDialog({
  isOpen,
  onClose,
  onConfirm,
  experimentName,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <DialogTitle>Delete Experiment</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete "{experimentName}"? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
