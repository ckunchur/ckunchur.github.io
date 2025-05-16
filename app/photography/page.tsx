"use client";
import Image from "next/image";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

type Photo = {
	src: string;
	category: string;
	storage_path: string;
};

// Update categories to match your Supabase folder structure
const categories = ["All", "Graduation", "Nature", "Travels"];
const travelDestinations = ["All", "Montreal", "Toronto", "India", "Lake Tahoe"];

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Photography() {
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [selectedDestination, setSelectedDestination] = useState("All");
	const [photos, setPhotos] = useState<Photo[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
	const [modalLoading, setModalLoading] = useState(false);

	const filteredPhotos = useMemo(() => {
		return photos.filter(photo => {
			const pathParts = photo.storage_path.split('/');
			const mainCategory = pathParts[0];
			if (selectedCategory === "All") return true;
			if (selectedCategory === "Travels") {
				if (selectedDestination === "All") {
					return mainCategory === "Travels";
				}
				return photo.storage_path.startsWith(`Travels/${selectedDestination}`);
			}
			return mainCategory === selectedCategory;
		});
	}, [photos, selectedCategory, selectedDestination]);

	useEffect(() => {
		const fetchPhotos = async () => {
			try {
				setLoading(true);
				const { data: rootData, error: rootError } = await supabase.storage
					.from('photos')
					.list('', {
						limit: 100,
						offset: 0,
						sortBy: { column: 'name', order: 'asc' }
					});
				if (rootError) return;
				let allFiles: { name: string; metadata?: { mimetype?: string } }[] = [];
				for (const folder of rootData ?? []) {
					if (folder.name === 'Travels') {
						const { data: travelsSubfolders, error: travelsError } = await supabase.storage
							.from('photos')
							.list('Travels', {
								limit: 100,
								offset: 0,
								sortBy: { column: 'name', order: 'asc' }
							});
						if (travelsError) continue;
						for (const subfolder of travelsSubfolders ?? []) {
							const { data: subfolderFiles, error: subfolderFilesError } = await supabase.storage
								.from('photos')
								.list(`Travels/${subfolder.name}`, {
									limit: 100,
									offset: 0,
									sortBy: { column: 'name', order: 'asc' }
								});
							if (subfolderFilesError) continue;
							for (const file of subfolderFiles ?? []) {
								if (file.metadata?.mimetype !== 'application/folder') {
									allFiles.push({
										name: `Travels/${subfolder.name}/${file.name}`,
										metadata: file.metadata
									});
								}
							}
						}
					} else {
						const { data: folderFiles, error: folderFilesError } = await supabase.storage
							.from('photos')
							.list(folder.name, {
								limit: 100,
								offset: 0,
								sortBy: { column: 'name', order: 'asc' }
							});
						if (folderFilesError) continue;
						for (const file of folderFiles ?? []) {
							if (file.metadata?.mimetype !== 'application/folder') {
								allFiles.push({
									name: `${folder.name}/${file.name}`,
									metadata: file.metadata
								});
							}
						}
					}
				}
				if (allFiles.length === 0) return;
				const photosWithUrls = await Promise.all(
					allFiles.map(async (file) => {
						const pathParts = file.name.split('/');
						const category = pathParts[0];
						const subcategory = pathParts[1];
						const { data: signedUrlData, error: signedUrlError } = await supabase.storage
							.from('photos')
							.createSignedUrl(file.name, 31536000);
						if (signedUrlError || !signedUrlData?.signedUrl) return null;
						return {
							src: signedUrlData.signedUrl,
							category: subcategory || category,
							storage_path: file.name
						};
					})
				);
				const validPhotos = photosWithUrls.filter((photo): photo is Photo => photo !== null);
				setPhotos(validPhotos);
			} catch (error) {
				// Optionally handle error
			} finally {
				setLoading(false);
			}
		};
		fetchPhotos();
	}, []);

	// Preload images when they're in view
	useEffect(() => {
		const preloadImages = () => {
			filteredPhotos.forEach(photo => {
				const img = new window.Image();
				img.src = photo.src;
			});
		};
		preloadImages();
	}, [filteredPhotos]);

	// Close modal when clicking outside the image
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (selectedPhoto && (event.target as HTMLElement).classList.contains('modal-backdrop')) {
				setSelectedPhoto(null);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [selectedPhoto]);

	// Close modal with Escape key
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setSelectedPhoto(null);
			}
		};
		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	}, []);

	const handlePhotoClick = (photo: Photo) => {
		setModalLoading(true);
		setSelectedPhoto(photo);
	};

	return (
		<div className="bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
			<Navigation />
			<div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
				<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-8">
					<div className="max-w-2xl">
						<h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
							Photography
						</h2>
						<p className="mt-4 text-zinc-400">
							A collection of moments captured through my lens, showcasing the beauty of nature, urban life, and humanity.
						</p>
					</div>
					<div className="flex gap-4">
						<select
							value={selectedCategory}
							onChange={(e) => {
								setSelectedCategory(e.target.value);
								setSelectedDestination("All");
							}}
							className="px-4 py-2 text-zinc-200 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600"
						>
							{categories.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</select>

						{selectedCategory === "Travels" && (
							<select
								value={selectedDestination}
								onChange={(e) => setSelectedDestination(e.target.value)}
								className="px-4 py-2 text-zinc-200 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600"
							>
								{travelDestinations.map((destination) => (
									<option key={destination} value={destination}>
										{destination}
									</option>
								))}
							</select>
						)}
					</div>
				</div>
				<div className="w-full h-px bg-zinc-800" />

				{/* Loading State */}
				{loading ? (
					<div className="flex justify-center items-center min-h-[400px]">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-200"></div>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
						{filteredPhotos.map((photo, index) => (
							<Card key={index}>
								<div 
									className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
									onClick={() => handlePhotoClick(photo)}
								>
									<Image
										src={photo.src}
										alt={photo.category}
										fill
										className="object-cover transition-transform duration-300 group-hover:scale-105"
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
										quality={75}
										onError={(e) => {
											console.error('Image failed to load:', photo.src);
											console.error('Error event:', e);
										}}
									/>
									<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-end">
										<div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
											<p className="text-sm text-zinc-300">
												{photo.storage_path.split('/')[0] === 'Travels' 
													? `${photo.storage_path.split('/')[1]}` 
													: photo.storage_path.split('/')[0]}
											</p>
										</div>
									</div>
								</div>
							</Card>
						))}
					</div>
				)}

				{/* Modal */}
				{selectedPhoto && (
					<div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop">
						{/* Blurred background */}
						<div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
						
						{/* Close button */}
						<button
							onClick={() => setSelectedPhoto(null)}
							className="absolute top-4 right-4 p-2 text-white hover:text-zinc-300 transition-colors z-10"
						>
							<X size={24} />
						</button>

						{/* Image container */}
						<div className="relative w-full h-full max-w-7xl max-h-[90vh] p-4 z-10">
							{modalLoading && (
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-200"></div>
								</div>
							)}
							<Image
								src={selectedPhoto.src}
								alt={selectedPhoto.category}
								fill
								className="object-contain"
								sizes="100vw"
								quality={100}
								priority
								onLoad={() => setModalLoading(false)}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
