import { useUser, useSession } from '@clerk/clerk-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './card';
import { MapPinIcon, Trash2Icon, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './button';
import { useState, useEffect } from 'react';
import { saveJob, removeSavedJob } from '@/api/apiJobs';

const JobCard = ({
    job,
    isMyJob = false,
    savedInit = false,
    onJobSaved = () => {},
    }) => {
    const { user } = useUser();
    const { session } = useSession();
    const [saved, setSaved] = useState(savedInit);
    const [loadingSavedJob, setLoadingSavedJob] = useState(false);
    
    useEffect(() => {
        setSaved(savedInit);
    }, [savedInit]);
    

    const handleSaveJob = async () => {
        if (!user) {
            alert('Please sign in to save jobs');
            return;
        }
        
        setLoadingSavedJob(true);
        try {
            if (!session) {
                alert('Session not available. Please sign in again.');
                return;
            }
            
            const token = await session.getToken({
                template: "supabase",
            });
            
            if (saved) {
                // Remove from saved jobs (both jobs and internships are stored in same table)
                await removeSavedJob(token, job.id);
            } else {
                // Save job (both jobs and internships are stored in same table)
                await saveJob(token, job.id);
            }
            
            // Toggle the local state
            const newSavedState = !saved;
            setSaved(newSavedState);
            onJobSaved(job.id, newSavedState);
        } catch (error) {
            console.error('Error saving job:', error);
            // Provide more specific error message based on the error type
            let errorMessage = 'Failed to save job';
            if (error.message) {
                errorMessage += `: ${error.message}`;
            }
            alert(errorMessage);
        } finally {
            setLoadingSavedJob(false);
        }
    };
    
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="flex justify-between font-bold">
                    {job.title}
                    {isMyJob && (
                        <Trash2Icon
                          fill="white"
                          size={18}
                          className="text-red-300 cursor-pointer"
                        />
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    {job.company && (
                        <>
                            {job.company.logo_url && (
                                <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', overflow: 'hidden' }}>
                                  <img src={job.company.logo_url} alt={job.company.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                            )}
                        </>
                    )}
                </div> 
                <div>
                        <MapPinIcon size={18} /> {job.location}
                </div>
                {job.description && (
                    <div className="mt-2">
                        <p className="text-sm text-gray-600">
                            {job.description.substring(0, job.description.indexOf(".") !== -1 ? job.description.indexOf(".") : job.description.length)}
                        </p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex gap-2 justify-between items-center">
                <Link to={`/job/${job.id}`} className="flex-1">
                  <Button variant="secondary" className="w-full">
                    More Details
                  </Button>
                </Link>
               {!isMyJob && (
                <Button
                  variant="outline"
                  className="w-12 h-10 flex items-center justify-center"
                  onClick={handleSaveJob}
                  disabled={loadingSavedJob}
                >
                  {saved ? (
                    <Heart size={20} fill="red" stroke="red" />
                  ) : (
                    <Heart size={20} />
                  )}
                </Button>
               )}
            </CardFooter>
        </Card>
    );
};

export default JobCard;