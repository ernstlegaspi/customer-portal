'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { bookingsAPI, messagesAPI } from '@/lib/api';
import type { Booking, Attachment, Message } from '@/types';
import { useForm } from 'react-hook-form';

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ message: string }>();

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
      fetchAttachments();
      fetchMessages();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const data = await bookingsAPI.getById(bookingId);
      setBooking(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch booking details');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAttachments = async () => {
    try {
      const data = await bookingsAPI.getAttachments(bookingId);
      setAttachments(data);
    } catch (err) {
      console.error('Failed to fetch attachments:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const data = await messagesAPI.getByBookingId(bookingId);
      setMessages(data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const onSubmitMessage = async (data: { message: string }) => {
    setIsSendingMessage(true);
    try {
      const newMessage = await messagesAPI.create(bookingId, data.message);
      setMessages([newMessage, ...messages]);
      reset();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to send message');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="text-lg text-gray-600">Loading booking details...</div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-800">{error || 'Booking not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-sm text-primary-600 hover:text-primary-900 flex items-center"
        >
          ← Back to bookings
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Booking Details</h3>
            <div className="mt-5 border-t border-gray-200">
              <dl className="divide-y divide-gray-200">
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{booking.address}</dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{booking.description}</dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                      {booking.status}
                    </span>
                  </dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Created Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {formatDate(booking.createdDate)}
                  </dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {formatDate(booking.updatedDate)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Attachments</h3>
            {attachments.length === 0 ? (
              <p className="text-sm text-gray-500">No attachments for this booking.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {attachments.map((attachment) => (
                  <li key={attachment.id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{attachment.fileName}</span>
                      <span className="ml-2 text-xs text-gray-500">({attachment.fileType})</span>
                    </div>
                    {attachment.fileUrl && (
                      <a
                        href={attachment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:text-primary-900"
                      >
                        View
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Messages</h3>

            <form onSubmit={handleSubmit(onSubmitMessage)} className="mb-6">
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Send a message
                </label>
                <textarea
                  id="message"
                  rows={3}
                  className="shadow-sm block w-full focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-gray-300 rounded-md p-2"
                  placeholder="Type your message here..."
                  {...register('message', { required: 'Message is required' })}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>
              <div className="mt-3">
                <button
                  type="submit"
                  disabled={isSendingMessage}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {isSendingMessage ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {messages.length === 0 ? (
                <p className="text-sm text-gray-500">No messages yet.</p>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-900">{message.customerEmail}</span>
                      <span className="text-xs text-gray-500">{formatDate(message.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{message.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}