import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Book, Users, Beaker } from "lucide-react";

const batchSchema = z.object({
  name: z.string().min(1, "Batch name is required"),
  subject: z.string().min(1, "Subject is required"),
  students: z.array(z.string()).nonempty("At least one student must be selected"),
  experiments: z.array(z.string()).optional(),
});

const BatchForm = () => {
  const form = useForm({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      name: "",
      subject: "",
      students: [],
      experiments: [],
    },
  });

  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newExperiment, setNewExperiment] = useState("");
  const [experiments, setExperiments] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/subjects`).then((res) => setSubjects(res.data));
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/students`).then((res) => {
      setStudents(res.data);
      setFilteredStudents(res.data);
    });
  }, []);

  useEffect(() => {
    // Enhanced filtering to allow searching by name or SAP ID
    setFilteredStudents(
      students.filter((student) =>
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.sapId && student.sapId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.rollNo && student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }, [searchTerm, students]);

  const handleAddExperiment = () => {
    if (newExperiment.trim()) {
      setExperiments([...experiments, newExperiment]);
      form.setValue("experiments", [...form.getValues("experiments"), newExperiment]);
      setNewExperiment("");
      setIsDialogOpen(false);
    }
  };

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Book className="w-6 h-6 text-blue-600" />
          Create New Batch
        </CardTitle>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 pt-6">
            {/* Batch Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Batch Name
              </Label>
              <FormField 
                control={form.control} 
                name="name" 
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        {...field} 
                        id="name" 
                        placeholder="Enter batch name" 
                        className="transition-all focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )} 
              />
            </div>

            {/* Subject Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Book className="w-4 h-4 text-blue-600" />
                Subject
              </Label>
              <FormField 
                control={form.control} 
                name="subject" 
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full transition-all focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject._id} value={subject._id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )} 
              />
            </div>

            {/* Students Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Students
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, roll no, or SAP ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 transition-all focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="border rounded-md max-h-48 overflow-y-auto bg-gray-50 mt-2">
                {filteredStudents.length === 0 ? (
                  <p className="text-gray-500 text-sm p-4 text-center">No students found</p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <li key={student._id} className="hover:bg-blue-50 transition-colors">
                        <div className="flex items-center p-3">
                          <FormField
                            control={form.control}
                            name="students"
                            render={() => (
                              <Checkbox
                                checked={form.getValues("students").includes(student._id)}
                                onCheckedChange={(checked) => {
                                  const selectedStudents = form.getValues("students");
                                  if (checked) {
                                    form.setValue("students", [...selectedStudents, student._id]);
                                  } else {
                                    form.setValue(
                                      "students",
                                      selectedStudents.filter((id) => id !== student._id)
                                    );
                                  }
                                }}
                                className="mr-3"
                              />
                            )}
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{student.studentName}</span>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                Roll: {student.rollNo}
                              </Badge>
                              {student.sapId && (
                                <Badge variant="outline" className="text-xs bg-blue-50">
                                  SAP ID: {student.sapId}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <FormMessage className="text-xs text-red-500" />
              <div className="mt-1 text-xs text-gray-500">
                {form.getValues("students").length} students selected
              </div>
            </div>

            {/* Experiments Section */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Beaker className="w-4 h-4 text-blue-600" />
                Experiments
              </Label>
              {experiments.length > 0 ? (
                <div className="bg-gray-50 p-3 rounded-md mb-2">
                  <ul className="space-y-2">
                    {experiments.map((exp, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                          {idx + 1}
                        </Badge>
                        <span className="text-sm">{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No experiments added yet</p>
              )}
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(true)}
                className="flex items-center gap-2 mt-2"
              >
                <Plus className="w-4 h-4" />
                Add Experiment
              </Button>
            </div>
          </CardContent>

          <CardFooter className="bg-gray-50 flex justify-end p-6">
            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-md hover:shadow-lg"
            >
              Create Batch
            </Button>
          </CardFooter>
        </form>
      </Form>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Beaker className="w-5 h-5 text-blue-600" />
              Add New Experiment
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter experiment title..."
              value={newExperiment}
              onChange={(e) => setNewExperiment(e.target.value)}
              className="transition-all focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <DialogFooter>
            <Button 
              onClick={handleAddExperiment}
              disabled={!newExperiment.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Add Experiment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default BatchForm;