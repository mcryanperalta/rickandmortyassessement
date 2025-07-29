<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\RickAndMortyServices;
use Symfony\Component\HttpFoundation\Request;

class RickAndMortyEpisodeApiAction extends AbstractController
{
    public function __construct(
        private RickAndMortyServices $rickAndMortyService

    ) {}

    #[Route('/api/episodes/all', name: 'api_episode_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $page = (int)$request->get('page') ?? 1;
        $characters = $this->rickAndMortyService->loadAllEpisodes($page);

        return $this->json($characters);
    }

    #[Route('/api/episode/{id}', name: 'api_episode_show', methods: ['GET'])]
    public function show(Request $request,$id): JsonResponse
    {
        $episode = $this->rickAndMortyService->loadEpisode($id);
        $characters = $episode->characters;
        $characterIds = [];
        foreach ($characters as $key => $value) {
            $characterIds[] =  basename($value);
        }
        
        return $this->json(['characterIds' => $characterIds,'episode' => $episode]);
        return $this->json($characters);
    }

    #[Route('/api/episodes/get-by-ids', name: 'api_episode_show_ids', methods: ['POST'])]
    public function getByIds(Request $request): JsonResponse
    {
        $episodeIds = $request->getContent();
        $episodeIds = json_decode($episodeIds,true);
        $characters = $this->rickAndMortyService->loadEpisodesById($episodeIds['episodes']);

        return $this->json($characters);
    }
}
