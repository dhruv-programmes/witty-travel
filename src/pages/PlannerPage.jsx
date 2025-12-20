import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usePlannerStore from '../store/plannerStore';
import InputForm from '../components/InputForm';
import AgentProgress from '../components/AgentProgress';
import ItineraryView from '../components/ItineraryView';

const PlannerPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { 
        currentPhase, 
        loadSession, 
        activeSessionId, 
        sessions, 
        createSession 
    } = usePlannerStore();

    useEffect(() => {
        if (id) {
            // Check if session exists
            const exists = sessions.find(s => s.id === id);
            if (exists) {
                if (activeSessionId !== id) {
                    loadSession(id);
                }
            } else {
                // Invalid ID, redirect to home or create new?
                navigate('/');
            }
        }
    }, [id, sessions, activeSessionId, loadSession, navigate]);

    const renderContent = () => {
        switch(currentPhase) {
          case 'input':
            return <InputForm />;
          case 'planning':
          case 'checking':
          case 'replanning':
          case 'finalizing':
          case 'error':
            return <AgentProgress />;
          case 'complete':
            return <ItineraryView />;
          default:
            return <InputForm />;
        }
    };

    // Use different container styling for ItineraryView (full width) vs other phases (constrained)
    const isItineraryView = currentPhase === 'complete';

    return (
        <div className={isItineraryView ? '' : 'max-w-5xl mx-auto p-6'}>
            {renderContent()}
        </div>
    );
};

export default PlannerPage;
