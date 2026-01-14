import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const ApplicationCard = ({ application, isCandidate = false }) => {
  const { job, status, created_at } = application;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{job?.title || 'N/A'}</span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            status === 'accepted' ? 'bg-green-100 text-green-800' :
            status === 'rejected' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {status || 'Pending'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">{job?.company?.name || 'N/A'} • {job?.location || 'N/A'}</p>
            <p className="text-xs text-gray-500 mt-1">Applied: {new Date(created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;