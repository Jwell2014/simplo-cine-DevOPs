// /* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { MovieCalendar } from "../../components/resources/MovieCalendar";
import { MovieCard } from "../../components/resources/MovieTable";
import { AddMovieCard } from "@/app/components/resources/AddMovieCard";
import { MovieView } from "@/app/components/resources/MovieView";
import { AddHallCard } from "@/app/components/resources/AddHallCard";
import { ScheduleScreeningForm } from "@/app/components/resources/ScheduleScreeningForm";

interface MovieAttributes {
  id: number;
  title: string;
  description?: string;
  release_date?: Date;
  duration?: number;
  created_at?: Date;
  updated_at?: Date;
  poster?: File | null;
}

interface HallAttributes {
  id: number;
  name: string;
  capacity: number;
}

export default function AdminDashboard() {
  const [movies, setMovies] = useState<MovieAttributes[]>([]);
  const [halls, setHalls] = useState<HallAttributes[]>([]);
  const [screenings, setScreenings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<MovieAttributes | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // useEffect(() => {
  //   const fetchMovies = async () => {
  //     try {
  //       const response = await fetch("/api/movies");
  //       if (!response.ok) {
  //         throw new Error("Erreur lors du fetch des films");
  //       }
  //       const data = await response.json();
  //       setMovies(data);
  //     } catch (err) {
  //       if (err instanceof Error) {
  //         setError(err.message);
  //       } else {
  //         setError("Une erreur inconnue est survenue");
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchMovies();
  // }, []);

  useEffect(() => {
    // Données en dur pour tester le calendrier, avec des dates au format `Date` au lieu de `string`
    const hardCodedMovies: MovieAttributes[] = [
      {
        id: 1,
        title: "Inception",
        description:
          "Dom Cobb est un voleur expérimenté dans l'art périlleux de l'extraction : sa spécialité consiste à s'approprier les secrets les plus précieux d'un individu...",
        release_date: new Date("2024-09-22T06:00:00Z"),
        duration: 180,
        created_at: new Date("2024-09-20T00:00:00Z"),
        updated_at: new Date("2024-09-20T00:00:00Z"),
      },
      {
        id: 2,
        title: "Flight to Paris",
        description: "Vol de JFK à CDG",
        release_date: new Date("2024-09-22T07:30:00Z"),
        duration: 120,
        created_at: new Date("2024-09-20T00:00:00Z"),
        updated_at: new Date("2024-09-20T00:00:00Z"),
      },
      {
        id: 3,
        title: "Sightseeing",
        description: "Visite de la Tour Eiffel",
        release_date: new Date("2024-09-22T11:00:00Z"),
        duration: 90,
        created_at: new Date("2024-09-20T00:00:00Z"),
        updated_at: new Date("2024-09-20T00:00:00Z"),
      },
    ];

    setMovies(hardCodedMovies);
    setLoading(false);
  }, []);

  const events = movies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    start: new Date(movie.release_date || movie.created_at || ""),
    end: new Date(
      moment(movie.release_date || movie.created_at)
        .add(movie.duration || 120, "minutes")
        .toDate()
    ),
    desc: movie.description || "",
  }));

  const handleSelectEvent = (event: any) => {
    const movie = movies.find((m) => m.id === event.id);
    if (movie) {
      setSelectedMovie(movie);
      setIsModalOpen(true);
    }
  };

  const handleAddMovie = (newMovie: MovieAttributes) => {
    setMovies([...movies, newMovie]);
  };

  const handleAddHall = (newHall: HallAttributes) => {
    setHalls([...halls, newHall]);
  };

  const handleScheduleScreening = (newScreening: any) => {
    setScreenings([...screenings, newScreening]);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleModifyMovie = (updatedMovie: MovieAttributes) => {
    setMovies(
      movies.map((movie) =>
        movie.id === updatedMovie.id ? updatedMovie : movie
      )
    );
  };

  const handleArchiveMovie = () => {
    if (selectedMovie) {
      setMovies(movies.filter((movie) => movie.id !== selectedMovie.id));
      handleCloseModal();
    }
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Gestion des Séances de Films
      </h1>

      {loading && <p>Chargement des films...</p>}
      {error && <p className="text-red-500">Erreur : {error}</p>}

      {!loading && !error && (
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne 1: Calendrier et Liste des Films */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg shadow-md">
              <h2 className="text-xl pl-6 font-semibold mb-4 text-gray-900">
                Calendrier des Séances
              </h2>
              <MovieCalendar
                events={events}
                onSelectEvent={handleSelectEvent}
              />
            </div>
            <div className="rounded-lg">
              <h2 className="text-xl pl-6 text-gray-900 font-semibold mb-4">
                Liste des Films
              </h2>
              <MovieCard movies={movies} />
            </div>
          </div>

          {/* Colonne 2: Formulaires à droite */}
          <div className="space-y-6">
            <div className="rounded-lg shadow-md">
              <AddMovieCard onAddMovie={handleAddMovie} halls={[]} />
            </div>
            <div className="rounded-lg shadow-md">
              <AddHallCard onAddHall={handleAddHall} />
            </div>
            <div className="rounded-lg shadow-md">
              <ScheduleScreeningForm
                movies={movies}
                halls={halls}
                onSchedule={handleScheduleScreening}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedMovie && (
        <MovieView
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          movie={selectedMovie}
          onModify={handleModifyMovie}
          onArchive={handleArchiveMovie}
          availableHalls={[]}
        />
      )}
    </div>
  );
}
