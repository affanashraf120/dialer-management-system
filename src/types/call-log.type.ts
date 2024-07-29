interface CallLog {
  id: number;
  sid: string;
  parentCallSid?: string;
  to: string;
  from: string;
  startTime: string;
  endTime: string;
  duration: string;
  toFormatted: string;
  fromFormatted: string;
  callDirection: string;
  isMissedCall?: boolean;
  agent?: Agent;
}

interface Agent {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  crmId: string;
}