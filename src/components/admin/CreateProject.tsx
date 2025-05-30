
import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useMutation, useQuery } from "@tanstack/react-query";
import { createProject, getProject, updateProject } from '@/lib/api/projects';
import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getCategories } from "@/lib/api/categories";
import { Editor } from "@/components/ui/editor"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ReloadIcon } from "@radix-ui/react-icons"
import { MultiSelect } from "@/components/ui/multi-select"
import { useDebounce } from "@/hooks/use-debounce";
import { getTags } from "@/lib/api/tags";
import { Project } from "@/types";

const projectSchema = yup.object({
  title: yup.string().required("Project title is required"),
  description: yup.string().required("Project description is required"),
  content: yup.string().required("Project content is required"),
  link: yup.string().url("Must be a valid URL").nullable(),
  githubLink: yup.string().url("Must be a valid URL").nullable(),
  startDate: yup.date().required("Start date is required"),
  endDate: yup.date().nullable(),
  isFeatured: yup.boolean().default(false),
  isPublished: yup.boolean().default(false),
  categoryId: yup.string().required("Category is required"),
  tags: yup.array().of(yup.string()).nullable(),
});

type ProjectFormValues = yup.InferType<typeof projectSchema>;

const CreateProject = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState('');
  const [categoriesList, setCategoriesList] = useState<{ value: string; label: string; }[]>([]);
  const [tagsList, setTagsList] = useState<{ value: string; label: string; }[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const debouncedContent = useDebounce(content, 500);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: yupResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      link: '',
      githubLink: '',
      startDate: new Date(),
      endDate: null,
      isFeatured: false,
      isPublished: false,
      categoryId: '',
      tags: [],
    },
  });

  const { data: projectData, isLoading: isProjectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProject(projectId as string),
    enabled: !!projectId,
  });

  React.useEffect(() => {
    if (projectData) {
      setValue('title', projectData.title);
      setValue('description', projectData.description);
      setValue('content', projectData.content);
      setContent(projectData.content);
      setValue('link', projectData.link || '');
      setValue('githubLink', projectData.githubLink || '');
      setValue('startDate', new Date(projectData.startDate));
      setValue('endDate', projectData.endDate ? new Date(projectData.endDate) : null);
      setValue('isFeatured', projectData.isFeatured);
      setValue('isPublished', projectData.isPublished);
      setValue('categoryId', projectData.categoryId);
      setSelectedTags(projectData.tags || []);
    }
  }, [projectData, setValue]);

  const { mutate: saveProject, isPending: isProjectSaving } = useMutation({
    mutationFn: async (data: ProjectFormValues) => {
      setIsSaving(true);
      setProgress(70);
      if (projectId) {
        return updateProject(projectId, { ...data, tags: selectedTags });
      }
      return createProject({ ...data, tags: selectedTags });
    },
    onSuccess: () => {
      setProgress(100);
      toast({
        title: "Success!",
        description: "Project saved successfully.",
      })
      setTimeout(() => {
        setIsSaving(false);
        setIsAlertDialogOpen(false);
        navigate('/admin/project-list');
      }, 500);
    },
    onError: (error: any) => {
      setIsSaving(false);
      toast({
        variant: "destructive",
        title: "Error!",
        description: error?.message || "Failed to save project.",
      })
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  React.useEffect(() => {
    if (categoriesData) {
      const categories = categoriesData.map((category) => ({
        value: category.id,
        label: category.name,
      }))
      setCategoriesList(categories);
    }
  }, [categoriesData]);

  const { data: tagsData, refetch: fetchTags } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
    enabled: false,
  });

  React.useEffect(() => {
    if (tagsData) {
      const tags = tagsData.map((tag) => ({
        value: tag.id,
        label: tag.name,
      }))
      setTagsList(tags);
    }
  }, [tagsData]);

  useEffect(() => {
    if (debouncedContent) {
      setValue('content', debouncedContent);
    }
  }, [debouncedContent, setValue]);

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const onSubmit = (data: ProjectFormValues) => {
    setIsAlertDialogOpen(true);
    setProgress(30);
    saveProject(data);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Project Title</Label>
                <Input id="title" placeholder="Project Title" type="text" {...register('title')} />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Project Description"
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Editor
                  value={content}
                  onChange={setContent}
                />
                {errors.content && (
                  <p className="text-sm text-red-500">{errors.content.message}</p>
                )}
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="link">Link</Label>
                <Input id="link" placeholder="Project Link" type="text" {...register('link')} />
                {errors.link && (
                  <p className="text-sm text-red-500">{errors.link.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="githubLink">Github Link</Label>
                <Input
                  id="githubLink"
                  placeholder="Github Link"
                  type="text"
                  {...register('githubLink')}
                />
                {errors.githubLink && (
                  <p className="text-sm text-red-500">{errors.githubLink.message}</p>
                )}
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Start Date</Label>
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <DatePicker
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={false}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500">{errors.startDate.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label>End Date</Label>
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <DatePicker
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={false}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">{errors.endDate.message}</p>
                )}
              </div>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="categoryId">Category</Label>
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesList?.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.categoryId && (
                  <p className="text-sm text-red-500">{errors.categoryId.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags</Label>
                <MultiSelect
                  options={tagsList}
                  value={selectedTags}
                  onChange={setSelectedTags}
                  onOpenChange={(open) => {
                    if (open) {
                      fetchTags();
                    }
                  }}
                />
                {errors.tags && (
                  <p className="text-sm text-red-500">{errors.tags.message}</p>
                )}
              </div>
            </div>
          </>
        );
      case 5:
        return (
          <>
            <div className="grid gap-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="isFeatured">Featured</Label>
                <Controller
                  control={control}
                  name="isFeatured"
                  render={({ field }) => (
                    <Switch
                      id="isFeatured"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="isPublished">Published</Label>
                <Controller
                  control={control}
                  name="isPublished"
                  render={({ field }) => (
                    <Switch
                      id="isPublished"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Project</CardTitle>
          <CardDescription>
            {projectId ? 'Edit your project here.' : 'Create a new project here.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="w-full">
              <Steps current={currentStep} onChange={handleStepChange} />
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {renderStepContent()}
            <div className="flex justify-between">
              {currentStep > 1 && (
                <Button variant="secondary" onClick={handlePrevStep}>
                  Previous
                </Button>
              )}
              {currentStep < 5 ? (
                <Button onClick={handleNextStep}>Next</Button>
              ) : (
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      Saving <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    'Save'
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to save?</AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm your action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isSaving} onClick={() => { }}>
              {isSaving ? (
                <Progress value={progress} className="w-full" />
              ) : (
                'Confirm'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

interface StepsProps {
  current: number;
  onChange: (step: number) => void;
}

const Steps: React.FC<StepsProps> = ({ current, onChange }) => {
  const steps = [1, 2, 3, 4, 5];

  return (
    <div className="flex w-full items-center space-x-4">
      {steps.map((step) => (
        <React.Fragment key={step}>
          {step > 1 && (
            <div className="flex-grow border-t border-default md:block"></div>
          )}
          <Button
            variant={step === current ? "default" : "ghost"}
            onClick={() => onChange(step)}
            className="relative w-10 h-10 rounded-full"
          >
            {step}
          </Button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default CreateProject;
