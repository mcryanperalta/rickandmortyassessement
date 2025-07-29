<?php

namespace App\Controller\Action;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/rick-and-morty')]
class RickAndMortyController extends AbstractController
{
    #[Route('/all', name: 'rick_and_morty_all')]
    public function index(): Response
    {
        return $this->render('characters/list.html.twig', [
            'title' => 'Rick and Morty Characters',
        ]);
    }

    #[Route('/character/{id}', name: 'rick_and_morty_character_view')]
    public function show($id): Response
    {
        return $this->render('characters/view.html.twig', [
            'characterId' => $id,
        ]);
    }

    #[Route('/locations/all', name: 'rick_and_morty_location_all')]
    public function locations(): Response
    {
        return $this->render('locations/list.html.twig', [
            'title' => 'Rick and Morty Locations',
        ]);
    }

    #[Route('/location/{id}', name: 'rick_and_morty_location_view')]
    public function showLocation($id): Response
    {
        return $this->render('locations/view.html.twig', [
            'locationId' => $id,
        ]);
    }

    #[Route('/episode/all', name: 'rick_and_morty_episode_all')]
    public function episodes(): Response
    {
        

        return $this->render('episodes/list.html.twig', [
            'title' => 'Rick and Morty Episodes',
        ]);
    }

    #[Route('/episode/{id}', name: 'rick_and_morty_episode_view')]
    public function showEpisode($id): Response
    {
        return $this->render('episodes/view.html.twig', [
            'episodeId' => $id,
        ]);
    }


    #[Route('/dimensions', name: 'rick_and_morty_dimension_search')]
    public function dimensions(Request $request): Response
    {   
        $search = $request->get('search');
        return $this->render('dimensions/search.html.twig', [
            'title' => 'Rick and Morty Search By Dimension',
            'search' => $search,
        ]);
    }

}
