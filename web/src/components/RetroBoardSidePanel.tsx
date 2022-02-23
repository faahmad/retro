import * as React from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { useParams } from "react-router-dom";
import { Retro } from "../types/retro";
import { useRetroState } from "../hooks/use-retro-state";
import moment from "moment";
import { useUpdateRetro } from "../hooks/use-update-retro";
import { useAnalyticsEvent, AnalyticsEvent } from "../hooks/use-analytics-event";
import { AnalyticsPage } from "../hooks/use-analytics-page";
import firebase from "../lib/firebase";

export function RetroBoardSidePanel({ isOpen, toggle }: any) {
  const params = useParams<{ retroId: Retro["id"] }>();
  const { state } = useRetroState(params.retroId);

  const name = state?.data?.name;
  const createdAt = moment(state?.data?.createdAt?.toDate()).format("YYYY-MM-DD");
  const isIncognito = state?.data?.isIncognito;

  const updateRetro = useUpdateRetro();
  const trackEvent = useAnalyticsEvent();
  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // @ts-ignore
    const createdAtJSDate = moment(event.target.createdAt.value, "YYYY-MM-DD").toDate();
    await updateRetro(params.retroId, {
      // @ts-ignore
      name: event.target?.name?.value,
      // @ts-ignore
      createdAt: firebase.firestore.Timestamp.fromDate(createdAtJSDate),
      // @ts-ignore
      isIncognito: event.target?.isIncognito?.checked
    });
    trackEvent(AnalyticsEvent.RETRO_UPDATED, {
      location: AnalyticsPage.RETRO_BOARD
    });
    toggle();
    return;
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={toggle}>
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="fixed inset-y-0 pl-16 max-w-full right-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-md border border-blue">
                <form
                  className="h-full divide-y divide-gray-200 flex flex-col bg-blue text-white shadow-xl"
                  onSubmit={handleSave}
                >
                  <div className="flex-1 h-0 overflow-y-auto">
                    <div className="py-6 px-4 bg-indigo-700 sm:px-6">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-medium text-white">
                          Retro Settings
                        </Dialog.Title>
                        <div className="ml-3 h-7 flex items-center">
                          <button
                            type="button"
                            className="bg-indigo-700 rounded-md text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                            onClick={toggle}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-indigo-300">
                          Only facilitators can adjust these
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="px-4 divide-y divide-gray-200 sm:px-6">
                        <div className="space-y-6 pt-6 pb-5">
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-white"
                            >
                              Name
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="name"
                                id="name"
                                className="border border-red px-1 block w-full shadow-sm text-blue h-8"
                                defaultValue={name}
                              />
                            </div>
                          </div>
                          <div>
                            <label
                              className="block text-sm font-medium text-white"
                              htmlFor="createdAt"
                            >
                              Date
                            </label>
                            <input
                              className="text-blue"
                              type="date"
                              id="createdAt"
                              name="createdAt"
                              defaultValue={createdAt}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <fieldset>
                        <legend className="text-sm font-medium text-white">
                          Privacy
                        </legend>
                        <div className="mt-2 space-y-5">
                          <div className="relative flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="isIncognito"
                                name="isIncognito"
                                aria-describedby="isIncognito-description"
                                type="checkbox"
                                className="h-4 w-4 text-red border-white"
                                defaultChecked={isIncognito}
                              />
                            </div>
                            <div className="pl-2 text-sm">
                              <label
                                htmlFor="isIncognito"
                                className="font-bold text-white"
                              >
                                Incognito
                              </label>
                              <p
                                id="isIncognito-description"
                                className="text-white text-xs"
                              >
                                Hide what people are writing during brainstorm.
                              </p>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  </div>
                  <div className="flex-shrink-0 px-4 py-4 flex justify-end">
                    <button
                      type="button"
                      className="bg-white py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium text-blue hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={toggle}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
