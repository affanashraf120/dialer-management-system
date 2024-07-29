interface CallSummary {
  totalCalls: number;
  inComingCalls: number;
  averageIncomingCalls: number;
  outgoingCalls: number;
  averageOutgoingCalls: number;
  missedCalls: number;
  averageMissedCalls: number;
  unattendedMissedCalls: number;
  averageUnattendedMissedCalls: number;
  totalCallDuration: number;
  averageCallDuration: number;
  totalIncomingCallDuration: number;
  averageIncomingCallDuration: number;
  totalOutgoingCallDuration: number;
  averageOutgoingCallDuration: number;
}



interface AgnentCallSummary {
  agent: Agent;
  summary: Summary;
}

interface Summary {
  totalCalls: number;
  inComingCalls: number;
  averageIncomingCalls: number;
  outgoingCalls: number;
  averageOutgoingCalls: number;
  missedCalls: number;
  averageMissedCalls: number;
  totalCallDuration: number;
  averageCallDuration: number;
  totalIncomingCallDuration: number;
  averageIncomingCallDuration: number;
  totalOutgoingCallDuration: number;
  averageOutgoingCallDuration: number;
}

interface Agent {
  firstName: string;
  lastName: string;
  email: string;
}