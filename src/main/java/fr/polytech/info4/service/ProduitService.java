package fr.polytech.info4.service;

import fr.polytech.info4.service.dto.ProduitDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link fr.polytech.info4.domain.Produit}.
 */
public interface ProduitService {
    /**
     * Save a produit.
     *
     * @param produitDTO the entity to save.
     * @return the persisted entity.
     */
    ProduitDTO save(ProduitDTO produitDTO);

    /**
     * Partially updates a produit.
     *
     * @param produitDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ProduitDTO> partialUpdate(ProduitDTO produitDTO);

    /**
     * Get all the produits.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ProduitDTO> findAll(Pageable pageable);

    /**
     * Get the "id" produit.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ProduitDTO> findOne(Long id);

    /**
     * Delete the "id" produit.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
